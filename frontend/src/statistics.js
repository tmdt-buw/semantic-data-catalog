const STATISTICS_NS = "https://w3id.org/solid-dataspace-manager/statistics#";
const LDP_RESOURCE = "http://www.w3.org/ns/ldp#Resource";

export const CATALOG_EVENT_TYPES = Object.freeze({
  datasetDownload: "dataset_download",
  semanticModelDownload: "semantic_model_download",
});

export const CATALOG_SURVEY_VERSION = "catalog-usability-v1";

export const CATALOG_SURVEY_QUESTION_IDS = Object.freeze({
  systemComprehensibility: "system_comprehensibility",
  datasetFindability: "dataset_findability",
});

export const CATALOG_SURFACES = Object.freeze({
  embedded: "embedded",
  standalone: "standalone",
});

const ALLOWED_EVENT_TYPES = new Set(Object.values(CATALOG_EVENT_TYPES));
const ALLOWED_SURVEY_QUESTION_IDS = new Set(Object.values(CATALOG_SURVEY_QUESTION_IDS));
const ALLOWED_CATALOG_SURFACES = new Set(Object.values(CATALOG_SURFACES));
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  return ["1", "true", "yes", "on"].includes(String(value || "").trim().toLowerCase());
};

const normalizeHttpUrl = (
  value,
  {
    container = false,
    stripHash = false,
    stripQuery = false,
    requireHttps = false,
  } = {}
) => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
    if (requireHttps && parsed.protocol !== "https:") return "";
    if (parsed.username || parsed.password) return "";
    if (stripHash) parsed.hash = "";
    if (container || stripQuery) parsed.search = "";
    const normalized = parsed.toString();
    return container && !normalized.endsWith("/") ? `${normalized}/` : normalized;
  } catch {
    return "";
  }
};

const normalizeOptionalContext = (value) => String(value || "").trim();

export const normalizeStatisticsConfig = (config = {}) => {
  const podBaseUrl = normalizeHttpUrl(config?.podBaseUrl, {
    container: true,
    stripHash: true,
    requireHttps: true,
  });
  const explicitEventsUrl = normalizeHttpUrl(config?.eventsUrl, {
    container: true,
    stripHash: true,
    requireHttps: true,
  });
  const eventsUrl = explicitEventsUrl || (podBaseUrl
    ? new URL("events/downloads/", podBaseUrl).href
    : "");
  return {
    enabled: parseBoolean(config?.enabled) && Boolean(eventsUrl),
    podBaseUrl,
    eventsUrl,
    registryContext: normalizeOptionalContext(config?.registryContext),
  };
};

export const resolveStatisticsConfig = ({
  embedded = false,
  statisticsConfig,
  runtimeEnv,
} = {}) => {
  if (statisticsConfig !== undefined) {
    return normalizeStatisticsConfig(statisticsConfig);
  }

  if (embedded) {
    return normalizeStatisticsConfig();
  }

  const env = runtimeEnv !== undefined
    ? runtimeEnv
    : (typeof window !== "undefined" ? window._env_ : undefined);

  return normalizeStatisticsConfig({
    enabled: env?.STATISTICS_ENABLED,
    podBaseUrl: env?.STATISTICS_POD_BASE_URL,
    eventsUrl: env?.STATISTICS_EVENTS_URL,
    registryContext: env?.STATISTICS_REGISTRY_CONTEXT,
  });
};

export const deriveSurveyEventsUrl = (eventsUrl) => {
  const normalized = normalizeHttpUrl(eventsUrl, {
    container: true,
    stripHash: true,
    requireHttps: true,
  });
  if (!normalized) return "";

  const parsed = new URL(normalized);
  const pathSegments = parsed.pathname.split("/").filter(Boolean);
  const suffixStart = pathSegments.length - 4;
  if (
    suffixStart < 0 ||
    pathSegments[suffixStart] !== "events" ||
    pathSegments[suffixStart + 1] !== "catalog-instances" ||
    !pathSegments[suffixStart + 2] ||
    pathSegments[suffixStart + 3] !== "downloads"
  ) {
    return "";
  }
  pathSegments[pathSegments.length - 1] = "survey-responses";
  parsed.pathname = `/${pathSegments.join("/")}/`;
  return parsed.href;
};

const createUuid = () => {
  const cryptoApi = typeof globalThis !== "undefined" ? globalThis.crypto : undefined;
  if (typeof cryptoApi?.randomUUID === "function") {
    return cryptoApi.randomUUID();
  }
  if (typeof cryptoApi?.getRandomValues === "function") {
    const bytes = cryptoApi.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    return Array.from(bytes, (byte, index) => {
      const hex = byte.toString(16).padStart(2, "0");
      return [4, 6, 8, 10].includes(index) ? `-${hex}` : hex;
    }).join("");
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === "x" ? random : ((random & 0x3) | 0x8);
    return value.toString(16);
  });
};

const normalizeTimestamp = (value) => {
  const date = value instanceof Date ? value : new Date(value || Date.now());
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
};

export const createCatalogEvent = ({
  eventType,
  dataset,
  resourceUrl,
  registryContext,
  eventId,
  occurredAt,
} = {}) => {
  if (!ALLOWED_EVENT_TYPES.has(eventType)) return null;

  const datasetUrl = normalizeHttpUrl(dataset?.datasetUrl, { stripQuery: true });
  // The action target may be a presigned URL. Validate it for the action, but
  // never persist it because query parameters can contain credentials.
  if (!datasetUrl || !normalizeHttpUrl(resourceUrl)) return null;

  return {
    eventId: eventId || createUuid(),
    eventType,
    datasetUrl,
    datasetTitle: String(dataset?.title || "").trim(),
    registryContext: normalizeOptionalContext(
      dataset?.registryContext || registryContext
    ),
    occurredAt: normalizeTimestamp(occurredAt),
  };
};

const escapeTurtleLiteral = (value) => String(value || "")
  .replace(/\\/g, "\\\\")
  .replace(/\"/g, '\\"')
  .replace(/\r/g, "\\r")
  .replace(/\n/g, "\\n")
  .replace(/\t/g, "\\t")
  .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, (char) =>
    `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`
  );

const turtleLiteral = (value, datatype = "") =>
  `"${escapeTurtleLiteral(value)}"${datatype ? `^^${datatype}` : ""}`;

export const serializeCatalogEvent = (event) => {
  const predicates = [
    `  stats:eventId ${turtleLiteral(event.eventId)}`,
    `  stats:eventType ${turtleLiteral(event.eventType)}`,
    `  stats:datasetUrl ${turtleLiteral(event.datasetUrl, "xsd:anyURI")}`,
    `  stats:datasetTitle ${turtleLiteral(event.datasetTitle)}`,
    `  stats:occurredAt ${turtleLiteral(event.occurredAt, "xsd:dateTime")}`,
  ];
  if (event.registryContext) {
    predicates.push(`  stats:registryContext ${turtleLiteral(event.registryContext)}`);
  }

  return [
    `@prefix stats: <${STATISTICS_NS}> .`,
    "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .",
    "",
    "<#event> a stats:CatalogEvent ;",
    `${predicates.join(" ;\n")} .`,
    "",
  ].join("\n");
};

export const createCatalogSurveyEvent = ({
  questionId,
  rating,
  catalogSurface,
  eventId,
  occurredAt,
  surveyVersion = CATALOG_SURVEY_VERSION,
} = {}) => {
  const normalizedRating = Number(rating);
  if (!ALLOWED_SURVEY_QUESTION_IDS.has(questionId)) return null;
  if (!Number.isInteger(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
    return null;
  }
  if (!ALLOWED_CATALOG_SURFACES.has(catalogSurface)) return null;

  const normalizedSurveyVersion = String(surveyVersion || "").trim();
  if (normalizedSurveyVersion !== CATALOG_SURVEY_VERSION) return null;
  const normalizedEventId = eventId ? String(eventId).trim().toLowerCase() : createUuid();
  if (!UUID_PATTERN.test(normalizedEventId)) return null;

  return {
    eventId: normalizedEventId,
    surveyVersion: normalizedSurveyVersion,
    questionId,
    rating: normalizedRating,
    catalogSurface,
    occurredAt: normalizeTimestamp(occurredAt),
  };
};

export const serializeCatalogSurveyEvent = (event) => [
  `@prefix stats: <${STATISTICS_NS}> .`,
  "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .",
  "",
  "<#event> a stats:CatalogSurveyResponse ;",
  `  stats:eventId ${turtleLiteral(event.eventId)} ;`,
  `  stats:surveyVersion ${turtleLiteral(event.surveyVersion)} ;`,
  `  stats:questionId ${turtleLiteral(event.questionId)} ;`,
  `  stats:rating ${turtleLiteral(event.rating, "xsd:integer")} ;`,
  `  stats:catalogSurface ${turtleLiteral(event.catalogSurface)} ;`,
  `  stats:occurredAt ${turtleLiteral(event.occurredAt, "xsd:dateTime")} .`,
  "",
].join("\n");

export const recordCatalogSurveyResponse = async ({
  session,
  statisticsConfig,
  questionId,
  rating,
  catalogSurface,
  eventId,
  occurredAt,
  surveyVersion,
} = {}) => {
  const config = normalizeStatisticsConfig(statisticsConfig);
  const surveyEventsUrl = deriveSurveyEventsUrl(config.eventsUrl);
  if (!config.enabled || !surveyEventsUrl) return false;
  if (!session?.info?.isLoggedIn || typeof session?.fetch !== "function") return false;

  const event = createCatalogSurveyEvent({
    questionId,
    rating,
    catalogSurface,
    eventId,
    occurredAt,
    surveyVersion,
  });
  if (!event) return false;

  const response = await session.fetch(surveyEventsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "text/turtle",
      Link: `<${LDP_RESOURCE}>; rel="type"`,
      Slug: `${event.eventId}.ttl`,
    },
    body: serializeCatalogSurveyEvent(event),
  });

  if (!response?.ok) {
    throw new Error(`Survey response write failed (${response?.status || "unknown"}).`);
  }
  return true;
};

export const recordCatalogEvent = async ({
  session,
  statisticsConfig,
  eventType,
  dataset,
  resourceUrl,
} = {}) => {
  const config = normalizeStatisticsConfig(statisticsConfig);
  if (!config.enabled) return false;
  if (!session?.info?.isLoggedIn || typeof session?.fetch !== "function") return false;

  const event = createCatalogEvent({
    eventType,
    dataset,
    resourceUrl,
    registryContext: config.registryContext,
  });
  if (!event) return false;

  const response = await session.fetch(config.eventsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "text/turtle",
      Link: `<${LDP_RESOURCE}>; rel="type"`,
      Slug: `${event.eventId}.ttl`,
    },
    body: serializeCatalogEvent(event),
  });

  if (!response?.ok) {
    throw new Error(`Statistics event write failed (${response?.status || "unknown"}).`);
  }
  return true;
};

export const trackCatalogEvent = async (options) => {
  try {
    return await recordCatalogEvent(options);
  } catch (error) {
    console.warn("Catalog statistics event could not be stored.", error);
    return false;
  }
};
