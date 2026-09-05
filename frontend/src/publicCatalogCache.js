const normalizeRegistry = (value) => `${String(value).replace(/\/+$/, "")}/`;
const documentUrl = (value) => String(value).split("#", 1)[0];
const safeUrl = (value) => {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password && !url.search;
  } catch { return false; }
};

export function publicCatalogCacheUrl(registry, currentHref, configuredBase) {
  const current = new URL(currentHref);
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(current.hostname);
  const base = configuredBase || (local ? "https://solid-dataspace-test.tmdt.info/sync-worker/public-cache" : "/sync-worker/public-cache");
  const target = new URL(`${base.replace(/\/+$/, "")}/catalog`, current.origin);
  if (!safeUrl(target.href) || target.hash) throw new Error("Invalid public catalog cache URL.");
  target.searchParams.set("registry", normalizeRegistry(registry));
  return target;
}

// No session fetch, credentials, localStorage, or cross-user in-memory results.
// Only public RDF documents are reused. The existing parser keeps the row model.
export async function loadPublicCatalogCache(registries, { fetchImpl = globalThis.fetch,
  currentHref = window.location.href, configuredBase = window._env_?.PUBLIC_CACHE_URL,
  timeoutMs = 10000 } = {}) {
  const snapshots = await Promise.all([...new Set(registries.map(normalizeRegistry))].map(async (registry) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const target = publicCatalogCacheUrl(registry, currentHref, configuredBase);
      const documents = new Map();
      let metadata;
      let offset = 0;
      let bytes = 0;
      for (let page = 0; page < 2048; page++) {
        const response = await fetchImpl(target.href, { credentials: "omit", cache: "no-store", signal: controller.signal });
        if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) return null;
        const value = await response.json();
        if (value?.schemaVersion !== 1 || normalizeRegistry(value.registryUrl) !== registry ||
          !["ready", "partial"].includes(value.status) || typeof value.revision !== "string" ||
          value.revision.length > 200 || typeof value.discoveryComplete !== "boolean" ||
          !(Date.parse(value.expiresAt) > Date.now()) || !Array.isArray(value.documents) ||
          !Array.isArray(value.members) || (metadata && value.revision !== metadata.revision)) return null;
        if (!metadata) {
          metadata = value;
          if (value.members.length > 256 || !value.members.every((m) => safeUrl(m.webId) && safeUrl(m.catalogUrl))) return null;
        }
        for (const doc of value.documents) {
          if (!doc || !safeUrl(doc.url) || doc.url.includes("#") || typeof doc.body !== "string" ||
            !["text/turtle", "application/n-triples"].includes(doc.contentType)) return null;
          bytes += doc.body.length;
          if (bytes > 32 * 1024 * 1024 || documents.size >= 2048) return null;
          documents.set(doc.url, doc);
        }
        if (value.nextOffset === null) return { ...metadata, documents };
        if (!Number.isSafeInteger(value.nextOffset) || value.nextOffset <= offset || value.nextOffset > 2048) return null;
        offset = value.nextOffset;
        target.searchParams.set("offset", String(offset));
        target.searchParams.set("revision", metadata.revision);
      }
      return null;
    } catch { return null; }
    finally { clearTimeout(timer); }
  }));
  return snapshots.filter(Boolean);
}

export function cachedCatalogFetch(snapshots, fallbackFetch, { ownCatalogUrl, isLoggedIn = false } = {}) {
  const catalogRoots = new Set(snapshots.flatMap((s) => s.members.map((m) => documentUrl(m.catalogUrl))));
  const docs = new Map(snapshots.flatMap((s) => [...s.documents]));
  let ownBase;
  try { ownBase = new URL(".", documentUrl(ownCatalogUrl)).href; } catch { /* Guest */ }
  return async (input, options) => {
    const url = documentUrl(typeof input === "string" ? input : input.url);
    const doc = docs.get(url);
    // Own metadata always fresh (including immediately after add/edit/delete).
    // Authenticated catalog roots can advertise additional private datasets.
    const method = options?.method || (typeof input === "object" && input.method) || "GET";
    const bypass = method.toUpperCase() !== "GET" ||
      (ownBase && url.startsWith(ownBase)) || (isLoggedIn && catalogRoots.has(url));
    if (!bypass && doc && snapshots.some((s) => s.documents.has(url) && Date.parse(s.expiresAt) > Date.now())) {
      const response = new Response(doc.body, { headers: { "Content-Type": doc.contentType } });
      // Inrupt resolves relative RDF IRIs against response.url, never the cache API.
      Object.defineProperty(response, "url", { value: doc.url });
      return response;
    }
    return fallbackFetch(input, options);
  };
}
