import {
  CATALOG_EVENT_TYPES,
  CATALOG_SURFACES,
  CATALOG_SURVEY_QUESTION_IDS,
  createCatalogEvent,
  createCatalogSurveyEvent,
  deriveSurveyEventsUrl,
  recordCatalogEvent,
  recordCatalogSurveyResponse,
  resolveStatisticsConfig,
  serializeCatalogEvent,
  serializeCatalogSurveyEvent,
} from "./statistics";
import { Parser } from "n3";

const dataset = {
  datasetUrl: "https://pod.example/catalog/ds/air.ttl#it",
  title: 'Air "quality"\nmeasurements',
};

describe("statistics configuration", () => {
  test("uses standalone runtime configuration", () => {
    expect(resolveStatisticsConfig({
      runtimeEnv: {
        STATISTICS_ENABLED: "true",
        STATISTICS_POD_BASE_URL: "https://stats.example/metrics",
        STATISTICS_REGISTRY_CONTEXT: "healthy-valley",
      },
    })).toEqual({
      enabled: true,
      podBaseUrl: "https://stats.example/metrics/",
      eventsUrl: "https://stats.example/metrics/events/downloads/",
      registryContext: "healthy-valley",
    });
  });

  test("explicit event URL takes priority over the Pod base URL", () => {
    expect(resolveStatisticsConfig({
      embedded: true,
      statisticsConfig: {
        enabled: true,
        podBaseUrl: "https://stats.example/statistics/",
        eventsUrl: "https://events.example/custom",
      },
    })).toEqual({
      enabled: true,
      podBaseUrl: "https://stats.example/statistics/",
      eventsUrl: "https://events.example/custom/",
      registryContext: "",
    });
  });

  test("embed derives its event container from an explicit Pod base URL", () => {
    expect(resolveStatisticsConfig({
      embedded: true,
      statisticsConfig: {
        enabled: true,
        podBaseUrl: "https://stats.example/statistics",
        eventsUrl: "   ",
      },
    })).toMatchObject({
      enabled: true,
      podBaseUrl: "https://stats.example/statistics/",
      eventsUrl: "https://stats.example/statistics/events/downloads/",
    });
  });

  test("removes query and fragment from statistics container URLs", () => {
    expect(resolveStatisticsConfig({
      statisticsConfig: {
        enabled: true,
        podBaseUrl: "https://stats.example/statistics?tenant=one#section",
      },
    })).toMatchObject({
      enabled: true,
      podBaseUrl: "https://stats.example/statistics/",
      eventsUrl: "https://stats.example/statistics/events/downloads/",
    });
  });

  test("does not send authenticated statistics to insecure containers", () => {
    expect(resolveStatisticsConfig({
      statisticsConfig: {
        enabled: true,
        podBaseUrl: "http://stats.example/statistics/",
        eventsUrl: "http://stats.example/events/",
      },
    })).toMatchObject({
      enabled: false,
      podBaseUrl: "",
      eventsUrl: "",
    });
  });

  test("explicit embed prop takes priority over runtime values", () => {
    expect(resolveStatisticsConfig({
      embedded: true,
      statisticsConfig: { enabled: false },
      runtimeEnv: {
        STATISTICS_ENABLED: true,
        STATISTICS_EVENTS_URL: "https://stats.example/events/",
      },
    }).enabled).toBe(false);
  });

  test("embed tracking is disabled when no prop is supplied", () => {
    expect(resolveStatisticsConfig({
      embedded: true,
      runtimeEnv: {
        STATISTICS_ENABLED: true,
        STATISTICS_EVENTS_URL: "https://stats.example/events/",
      },
    }).enabled).toBe(false);
  });
});

describe("catalog event serialization", () => {
  test("keeps the canonical RDF dataset URL and escapes literals", () => {
    const event = createCatalogEvent({
      eventType: CATALOG_EVENT_TYPES.datasetDownload,
      dataset,
      resourceUrl: "https://pod.example/files/air.csv",
      registryContext: "https://registry.example/research/",
      eventId: "77b20b0f-e506-4e75-ac4c-5779a21c6f7a",
      occurredAt: "2026-07-14T08:09:10.000Z",
    });
    const turtle = serializeCatalogEvent(event);

    expect(event.datasetUrl).toBe(dataset.datasetUrl);
    expect(turtle).toContain('stats:eventType "dataset_download"');
    expect(turtle).toContain('stats:datasetUrl "https://pod.example/catalog/ds/air.ttl#it"^^xsd:anyURI');
    expect(turtle).toContain('stats:datasetTitle "Air \\"quality\\"\\nmeasurements"');
    expect(turtle).toContain('stats:registryContext "https://registry.example/research/"');
    expect(turtle).not.toContain("stats:resourceUrl");
    expect(() => new Parser().parse(turtle)).not.toThrow();
  });

  test("does not persist action URL secrets and canonicalizes the dataset URL", () => {
    const event = createCatalogEvent({
      eventType: CATALOG_EVENT_TYPES.semanticModelDownload,
      dataset: {
        ...dataset,
        datasetUrl:
          "https://pod.example/catalog/ds/air.ttl?token=metadata-secret#it",
      },
      resourceUrl: "https://source.example/data/air?signature=raw-secret",
    });
    const turtle = serializeCatalogEvent(event);

    expect(event.datasetUrl).toBe(dataset.datasetUrl);
    expect(turtle).not.toContain("metadata-secret");
    expect(turtle).not.toContain("raw-secret");
    expect(turtle).not.toContain("source.example");
  });

  test("rejects credential-bearing dataset metadata URLs", () => {
    expect(createCatalogEvent({
      eventType: CATALOG_EVENT_TYPES.datasetDownload,
      dataset: {
        ...dataset,
        datasetUrl: "https://user:secret@pod.example/catalog/ds/air.ttl#it",
      },
      resourceUrl: "https://pod.example/files/air.csv",
    })).toBeNull();
  });
});

describe("catalog survey statistics", () => {
  const canonicalDownloadUrl =
    "https://stats.example/statistics/events/catalog-instances/test/downloads/";

  test("derives only a provisioned per-instance survey container", () => {
    expect(deriveSurveyEventsUrl(canonicalDownloadUrl)).toBe(
      "https://stats.example/statistics/events/catalog-instances/test/survey-responses/"
    );
    expect(deriveSurveyEventsUrl("https://stats.example/statistics/events/downloads/")).toBe("");
    expect(deriveSurveyEventsUrl("https://stats.example/custom/downloads/")).toBe("");
    expect(deriveSurveyEventsUrl("http://stats.example/events/catalog-instances/test/downloads/")).toBe("");
  });

  test("serializes one anonymous answer with an independent question id", () => {
    const event = createCatalogSurveyEvent({
      questionId: CATALOG_SURVEY_QUESTION_IDS.systemComprehensibility,
      rating: 4,
      catalogSurface: CATALOG_SURFACES.embedded,
      eventId: "77b20b0f-e506-4e75-ac4c-5779a21c6f7a",
      occurredAt: "2026-07-22T08:09:10.000Z",
    });
    const turtle = serializeCatalogSurveyEvent(event);

    expect(turtle).toContain("a stats:CatalogSurveyResponse");
    expect(turtle).toContain('stats:surveyVersion "catalog-usability-v1"');
    expect(turtle).toContain('stats:questionId "system_comprehensibility"');
    expect(turtle).toContain('stats:rating "4"^^xsd:integer');
    expect(turtle).toContain('stats:catalogSurface "embedded"');
    expect(turtle).not.toContain("webId");
    expect(turtle).not.toContain("userAgent");
    expect(() => new Parser().parse(turtle)).not.toThrow();
  });

  test("rejects invalid questions, ratings, and surfaces", () => {
    expect(createCatalogSurveyEvent({
      questionId: "combined_score",
      rating: 5,
      catalogSurface: CATALOG_SURFACES.standalone,
    })).toBeNull();
    expect(createCatalogSurveyEvent({
      questionId: CATALOG_SURVEY_QUESTION_IDS.datasetFindability,
      rating: 6,
      catalogSurface: CATALOG_SURFACES.standalone,
    })).toBeNull();
    expect(createCatalogSurveyEvent({
      questionId: CATALOG_SURVEY_QUESTION_IDS.datasetFindability,
      rating: 3,
      catalogSurface: "unknown",
    })).toBeNull();
    expect(createCatalogSurveyEvent({
      questionId: CATALOG_SURVEY_QUESTION_IDS.datasetFindability,
      rating: 3,
      catalogSurface: CATALOG_SURFACES.standalone,
      surveyVersion: "catalog-usability-v2",
    })).toBeNull();
    expect(createCatalogSurveyEvent({
      questionId: CATALOG_SURVEY_QUESTION_IDS.datasetFindability,
      rating: 3,
      catalogSurface: CATALOG_SURFACES.standalone,
      eventId: "not-a-uuid",
    })).toBeNull();
  });

  test("POSTs one answer to the derived survey leaf and preserves retry ids", async () => {
    const fetch = jest.fn().mockResolvedValue({ ok: true, status: 201 });
    const eventId = "77b20b0f-e506-4e75-ac4c-5779a21c6f7a";
    const options = {
      session: { info: { isLoggedIn: true }, fetch },
      statisticsConfig: { enabled: true, eventsUrl: canonicalDownloadUrl },
      questionId: CATALOG_SURVEY_QUESTION_IDS.datasetFindability,
      rating: 5,
      catalogSurface: CATALOG_SURFACES.standalone,
      eventId,
      occurredAt: "2026-07-22T08:09:10.000Z",
    };

    await expect(recordCatalogSurveyResponse(options)).resolves.toBe(true);
    await expect(recordCatalogSurveyResponse(options)).resolves.toBe(true);

    expect(fetch).toHaveBeenCalledTimes(2);
    fetch.mock.calls.forEach(([url, request]) => {
      expect(url).toBe(
        "https://stats.example/statistics/events/catalog-instances/test/survey-responses/"
      );
      expect(request.headers.Slug).toBe(`${eventId}.ttl`);
      expect(request.body).toContain('stats:questionId "dataset_findability"');
      expect(request.body).not.toContain("webId");
    });
  });

  test("fails closed when only a legacy statistics container is configured", async () => {
    const fetch = jest.fn();
    await expect(recordCatalogSurveyResponse({
      session: { info: { isLoggedIn: true }, fetch },
      statisticsConfig: {
        enabled: true,
        eventsUrl: "https://stats.example/statistics/events/downloads/",
      },
      questionId: CATALOG_SURVEY_QUESTION_IDS.datasetFindability,
      rating: 5,
      catalogSurface: CATALOG_SURFACES.standalone,
    })).resolves.toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("recordCatalogEvent", () => {
  test("POSTs an anonymous Turtle resource with Slug semantics", async () => {
    const fetch = jest.fn().mockResolvedValue({ ok: true, status: 201 });
    const session = {
      info: {
        isLoggedIn: true,
        webId: "https://pod.example/profile/card#me",
      },
      fetch,
    };

    await expect(recordCatalogEvent({
      session,
      statisticsConfig: {
        enabled: true,
        eventsUrl: "https://stats.example/events/downloads/",
      },
      eventType: CATALOG_EVENT_TYPES.semanticModelDownload,
      dataset,
      resourceUrl: "https://source.example/data/model.ttl",
    })).resolves.toBe(true);

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, request] = fetch.mock.calls[0];
    expect(url).toBe("https://stats.example/events/downloads/");
    expect(request.method).toBe("POST");
    expect(request.headers["Content-Type"]).toBe("text/turtle");
    expect(request.headers.Link).toBe('<http://www.w3.org/ns/ldp#Resource>; rel="type"');
    expect(request.headers.Slug).toMatch(/^[0-9a-f-]{36}\.ttl$/);
    expect(request.body).toContain('stats:eventType "semantic_model_download"');
    expect(request.body).not.toContain("source.example");
    expect(request.body).not.toContain(session.info.webId);
    expect(request.body).not.toContain("userAgent");
  });

  test("does not create or write retired dataset-access events", async () => {
    const fetch = jest.fn();
    expect(createCatalogEvent({
      eventType: "dataset_access",
      dataset,
      resourceUrl: "https://source.example/data/air",
    })).toBeNull();

    await expect(recordCatalogEvent({
      session: { info: { isLoggedIn: true }, fetch },
      statisticsConfig: {
        enabled: true,
        eventsUrl: "https://stats.example/events/downloads/",
      },
      eventType: "dataset_access",
      dataset,
      resourceUrl: "https://source.example/data/air",
    })).resolves.toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });

  test("does not write without an authenticated session", async () => {
    const fetch = jest.fn();
    await expect(recordCatalogEvent({
      session: { info: { isLoggedIn: false }, fetch },
      statisticsConfig: {
        enabled: true,
        eventsUrl: "https://stats.example/events/downloads/",
      },
      eventType: CATALOG_EVENT_TYPES.datasetDownload,
      dataset,
      resourceUrl: "https://pod.example/files/air.csv",
    })).resolves.toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });
});
