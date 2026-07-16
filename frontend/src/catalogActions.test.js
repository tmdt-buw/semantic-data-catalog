import {
  downloadCatalogResource,
  openDatasetAccess,
} from "./catalogActions";
import { CATALOG_EVENT_TYPES } from "./statistics";

const dataset = {
  datasetUrl: "https://pod.example/catalog/ds/air.ttl#it",
  title: "Air quality",
};

const createBrowser = (order) => ({
  document: {
    createElement: () => ({
      click: () => order.push("click"),
    }),
  },
  URL: {
    createObjectURL: () => "blob:test",
    revokeObjectURL: () => order.push("revoke"),
  },
});

describe("catalog resource actions", () => {
  test("records a dataset download only after a successful blob fetch", async () => {
    const order = [];
    const session = {
      fetch: jest.fn(async () => {
        order.push("fetch");
        return {
          ok: true,
          blob: async () => {
            order.push("blob");
            return {};
          },
        };
      }),
    };
    const trackEvent = jest.fn((event) => {
      order.push(`track:${event.eventType}`);
    });

    await downloadCatalogResource({
      session,
      dataset,
      resourceUrl: "https://pod.example/files/air.csv",
      fileName: "air.csv",
      eventType: CATALOG_EVENT_TYPES.datasetDownload,
      statisticsConfig: { enabled: true },
      fallbackToDatasetAccess: true,
      trackEvent,
      browser: createBrowser(order),
    });

    expect(order).toEqual([
      "fetch",
      "blob",
      "track:dataset_download",
      "click",
      "revoke",
    ]);
  });

  test("records dataset access before opening a download fallback", async () => {
    const order = [];
    const trackEvent = jest.fn((event) => {
      order.push(`track:${event.eventType}`);
    });
    const openLink = jest.fn(() => order.push("open"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await downloadCatalogResource({
      session: {
        fetch: jest.fn(async () => {
          order.push("fetch");
          return { ok: false };
        }),
      },
      dataset,
      resourceUrl: "https://source.example/air.csv",
      fileName: "air.csv",
      eventType: CATALOG_EVENT_TYPES.datasetDownload,
      fallbackToDatasetAccess: true,
      trackEvent,
      openLink,
    });

    expect(order).toEqual(["fetch", "track:dataset_access", "open"]);
    expect(trackEvent).not.toHaveBeenCalledWith(
      expect.objectContaining({ eventType: CATALOG_EVENT_TYPES.datasetDownload })
    );
    consoleSpy.mockRestore();
  });

  test("does not count a failed semantic-model download", async () => {
    const trackEvent = jest.fn();
    const openLink = jest.fn();
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await downloadCatalogResource({
      session: { fetch: jest.fn().mockResolvedValue({ ok: false }) },
      dataset,
      resourceUrl: "https://source.example/model.ttl",
      fileName: "model.ttl",
      eventType: CATALOG_EVENT_TYPES.semanticModelDownload,
      trackEvent,
      openLink,
    });

    expect(trackEvent).not.toHaveBeenCalled();
    expect(openLink).toHaveBeenCalledWith("https://source.example/model.ttl");
    consoleSpy.mockRestore();
  });

  test("starts an access event before window.open and ignores tracking errors", () => {
    const order = [];
    const trackEvent = jest.fn(() => {
      order.push("track");
      throw new Error("statistics unavailable");
    });
    const windowRef = {
      open: jest.fn(() => order.push("open")),
    };

    expect(openDatasetAccess({
      session: {},
      dataset,
      resourceUrl: "https://source.example/air",
      statisticsConfig: { enabled: true },
      trackEvent,
      windowRef,
    })).toBe(true);

    expect(order).toEqual(["track", "open"]);
  });
});

