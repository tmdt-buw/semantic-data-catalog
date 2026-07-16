import {
  CATALOG_EVENT_TYPES,
  createCatalogEvent,
  recordCatalogEvent,
  resolveStatisticsConfig,
  serializeCatalogEvent,
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
      eventType: CATALOG_EVENT_TYPES.datasetAccess,
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
      eventType: CATALOG_EVENT_TYPES.datasetAccess,
      dataset,
      resourceUrl: "https://source.example/data/air",
    })).resolves.toBe(true);

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, request] = fetch.mock.calls[0];
    expect(url).toBe("https://stats.example/events/downloads/");
    expect(request.method).toBe("POST");
    expect(request.headers["Content-Type"]).toBe("text/turtle");
    expect(request.headers.Link).toBe('<http://www.w3.org/ns/ldp#Resource>; rel="type"');
    expect(request.headers.Slug).toMatch(/^[0-9a-f-]{36}\.ttl$/);
    expect(request.body).toContain('stats:eventType "dataset_access"');
    expect(request.body).not.toContain("source.example");
    expect(request.body).not.toContain(session.info.webId);
    expect(request.body).not.toContain("userAgent");
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
