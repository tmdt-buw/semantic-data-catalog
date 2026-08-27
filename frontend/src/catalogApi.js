import {
  assertCatalogDatasetDeletionTarget,
  createDataset,
  deleteDatasetEntry,
  ensureRestrictedResourceAccess,
  getPodRoot,
  loadRegistryConfig,
} from "./solidCatalog";

const IDENTIFIER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

const generateIdentifier = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `dataset-${Date.now()}`;
};

const normalizeContactEmail = (value) => {
  const candidate = String(value || "").trim().replace(/^mailto:/, "");
  return candidate.includes("@") && !candidate.includes(":") ? candidate : "";
};

const normalizeContactUrl = (value) => {
  const candidate = String(value || "").trim();
  if (!candidate) return "";
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch {
    return "";
  }
};

const normalizePodRoot = (value) => {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value !== "string" || value.trim() !== value) {
    throw new Error("Pod root must be an absolute HTTP(S) container URL.");
  }
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Pod root must be an absolute HTTP(S) container URL.");
  }
  if (
    (url.protocol !== "https:" && url.protocol !== "http:") ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error("Pod root must be an absolute HTTP(S) container URL.");
  }
  return url.href.endsWith("/") ? url.href : `${url.href}/`;
};

export function normalizeRestrictedDatasetInput(session, input = {}) {
  if (!session?.info?.webId || typeof session.fetch !== "function") {
    throw new Error("An authenticated Solid session is required.");
  }
  const identifier = String(input.identifier || generateIdentifier()).trim();
  if (!IDENTIFIER_PATTERN.test(identifier)) {
    throw new Error("Dataset identifier contains unsupported characters.");
  }
  const distributionUrl = String(
    input.distributionUrl || input.access_url_dataset || input.dataUrl || ""
  ).trim();
  if (!distributionUrl) throw new Error("A dataset distribution URL is required.");
  const includeCreator = input.includeCreator !== false && input.omitCreator !== true;
  const contactPoint = input.contactPoint || input.contact_point || "";
  const explicitContactUrl =
    input.contactPointWebId ||
    input.contactWebId ||
    input.contactPointUrl ||
    input.contactUrl ||
    input.contact_url ||
    contactPoint;

  return {
    podRoot: normalizePodRoot(input.podRoot || input.pod_root),
    identifier,
    title: String(input.title || "").trim(),
    description: String(input.description || "").trim(),
    issued: input.issued || new Date().toISOString(),
    publisher: String(input.publisher || "").trim(),
    publisher_url: normalizeContactUrl(
      input.publisherWebId || input.publisherUrl || input.publisher_url
    ),
    contact_point: normalizeContactEmail(contactPoint),
    contact_url: normalizeContactUrl(explicitContactUrl),
    access_url_dataset: distributionUrl,
    access_url_semantic_model: String(
      input.semanticModelUrl || input.access_url_semantic_model || ""
    ).trim(),
    file_format: String(input.mediaType || input.file_format || "").trim(),
    theme: String(input.theme || "").trim(),
    webid: includeCreator
      ? String(input.creatorWebId || input.webid || session.info.webId).trim()
      : "",
    distribution_access_type: "download",
    is_public: false,
    strict_restricted_acl: true,
    require_discoverable_registry:
      input.requireDiscoverableRegistry === true ||
      input.require_discoverable_registry === true,
  };
}

export async function publishRestrictedDataset(session, input = {}) {
  const normalized = normalizeRestrictedDatasetInput(session, input);
  const podRoot = normalized.podRoot || getPodRoot(session.info.webId);
  const datasetUrl = `${podRoot}catalog/ds/${normalized.identifier}.ttl#it`;
  const recordUrl = `${podRoot}catalog/records/${normalized.identifier}.ttl`;

  if (normalized.require_discoverable_registry) {
    const registryConfig = await loadRegistryConfig(
      session.info.webId,
      session.fetch,
      { podRoot }
    );
    if (
      registryConfig?.mode !== "research" ||
      !Array.isArray(registryConfig.registries) ||
      registryConfig.registries.length === 0
    ) {
      const error = new Error(
        "A public Dataspace registry must be configured before this dataset can be published."
      );
      error.code = "discoverable-registry-required";
      throw error;
    }
    normalized.registryConfig = registryConfig;
  }

  await ensureRestrictedResourceAccess(session, normalized.access_url_dataset, {
    podRoot,
  });
  if (normalized.access_url_semantic_model) {
    await ensureRestrictedResourceAccess(
      session,
      normalized.access_url_semantic_model,
      { podRoot }
    );
  }

  try {
    const created = await createDataset(session, normalized);
    return {
      ...created,
      recordUrl,
      distributionUrl: normalized.access_url_dataset,
    };
  } catch (error) {
    try {
      await deleteDatasetEntry(session, datasetUrl, normalized.identifier, { podRoot });
    } catch (cleanupError) {
      console.warn("Failed to clean up incomplete restricted dataset metadata.", cleanupError);
    }
    throw error;
  }
}

export async function removeDataset(session, reference = {}) {
  if (!session?.info?.webId || typeof session.fetch !== "function") {
    throw new Error("An authenticated Solid session is required.");
  }
  const input = typeof reference === "string" ? { datasetUrl: reference } : reference;
  const explicitPodRoot = normalizePodRoot(input.podRoot || input.pod_root);
  const podRoot = explicitPodRoot || getPodRoot(session.info.webId);
  const identifier = String(input.identifier || "").trim();
  if (identifier && !IDENTIFIER_PATTERN.test(identifier)) {
    throw new Error("Dataset identifier contains unsupported characters.");
  }
  const datasetUrl = String(
    input.datasetUrl ||
      (identifier
        ? `${podRoot}catalog/ds/${identifier}.ttl#it`
        : "")
  ).trim();
  if (!datasetUrl) throw new Error("datasetUrl or identifier is required.");
  const safeDatasetUrl = assertCatalogDatasetDeletionTarget(
    podRoot,
    datasetUrl,
    identifier
  );

  await deleteDatasetEntry(session, safeDatasetUrl, identifier, { podRoot });
  return { removed: true, datasetUrl: safeDatasetUrl, identifier };
}
