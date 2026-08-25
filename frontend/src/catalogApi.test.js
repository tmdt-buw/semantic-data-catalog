import {
  createDataset,
  deleteDatasetEntry,
  ensureRestrictedResourceAccess,
  getPodRoot,
} from "./solidCatalog";
import {
  normalizeRestrictedDatasetInput,
  publishRestrictedDataset,
  removeDataset,
} from "./catalogApi";

jest.mock("./solidCatalog", () => ({
  createDataset: jest.fn(),
  deleteDatasetEntry: jest.fn(),
  ensureRestrictedResourceAccess: jest.fn(),
  getPodRoot: jest.fn(() => "https://pod.example/laura/"),
}));

const session = {
  info: { webId: "https://pod.example/laura/profile/card#me" },
  fetch: jest.fn(),
};

const input = {
  identifier: "solid-tours-activity-run-1",
  title: "Completed planned route",
  description: "Route and calculated activity summary",
  distributionUrl:
    "https://pod.example/laura/solid-tours/runs/run-1/activity.geojson",
  mediaType: "application/geo+json",
  publisher: "Hannah Müller",
  publisherWebId: session.info.webId,
  contactPoint: "hannah.mueller@sscon-praesentation.de",
  contactPointWebId: session.info.webId,
  creatorWebId: session.info.webId,
  includeCreator: false,
};

beforeEach(() => {
  jest.clearAllMocks();
  getPodRoot.mockReturnValue("https://pod.example/laura/");
  ensureRestrictedResourceAccess.mockResolvedValue(undefined);
  createDataset.mockResolvedValue({
    datasetUrl:
      "https://pod.example/laura/catalog/ds/solid-tours-activity-run-1.ttl#it",
    identifier: input.identifier,
  });
  deleteDatasetEntry.mockResolvedValue(undefined);
});

test("normalizes the public API aliases into a fail-closed restricted dataset", () => {
  expect(normalizeRestrictedDatasetInput(session, input)).toMatchObject({
    identifier: input.identifier,
    access_url_dataset: input.distributionUrl,
    file_format: "application/geo+json",
    webid: "",
    contact_point: "hannah.mueller@sscon-praesentation.de",
    contact_url: session.info.webId,
    publisher: "Hannah Müller",
    publisher_url: session.info.webId,
    distribution_access_type: "download",
    is_public: false,
    strict_restricted_acl: true,
  });
});

test("keeps creator metadata by default for existing catalog callers", () => {
  expect(
    normalizeRestrictedDatasetInput(session, {
      ...input,
      includeCreator: undefined,
    }).webid
  ).toBe(session.info.webId);
});

test("publishes only after the distribution ACL was verified restricted", async () => {
  const result = await publishRestrictedDataset(session, input);

  expect(ensureRestrictedResourceAccess).toHaveBeenCalledWith(
    session,
    input.distributionUrl
  );
  expect(ensureRestrictedResourceAccess.mock.invocationCallOrder[0]).toBeLessThan(
    createDataset.mock.invocationCallOrder[0]
  );
  expect(createDataset).toHaveBeenCalledWith(
    session,
    expect.objectContaining({
      access_url_dataset: input.distributionUrl,
      is_public: false,
      strict_restricted_acl: true,
      webid: "",
    })
  );
  expect(result).toMatchObject({
    identifier: input.identifier,
    distributionUrl: input.distributionUrl,
    recordUrl:
      "https://pod.example/laura/catalog/records/solid-tours-activity-run-1.ttl",
  });
});

test("fails before catalog publication when restricted ACL verification fails", async () => {
  ensureRestrictedResourceAccess.mockRejectedValue(new Error("ACL unavailable"));
  await expect(publishRestrictedDataset(session, input)).rejects.toThrow(
    "ACL unavailable"
  );
  expect(createDataset).not.toHaveBeenCalled();
});

test("cleans incomplete metadata without masking a publication error", async () => {
  createDataset.mockRejectedValue(new Error("catalog write failed"));
  await expect(publishRestrictedDataset(session, input)).rejects.toThrow(
    "catalog write failed"
  );
  expect(deleteDatasetEntry).toHaveBeenCalledWith(
    session,
    "https://pod.example/laura/catalog/ds/solid-tours-activity-run-1.ttl#it",
    input.identifier
  );
});

test("removes a dataset idempotently from an identifier reference", async () => {
  const result = await removeDataset(session, { identifier: input.identifier });
  expect(deleteDatasetEntry).toHaveBeenCalledWith(
    session,
    "https://pod.example/laura/catalog/ds/solid-tours-activity-run-1.ttl#it",
    input.identifier
  );
  expect(result.removed).toBe(true);
});

test("does not report removal when dataset or record cleanup is incomplete", async () => {
  const partialFailure = new AggregateError(
    [new Error("record delete failed")],
    "Catalog dataset deletion incomplete"
  );
  deleteDatasetEntry.mockRejectedValueOnce(partialFailure);

  await expect(
    removeDataset(session, { identifier: input.identifier })
  ).rejects.toBe(partialFailure);
});
