import {
  assertCatalogDatasetDeletionTarget,
  createDataset,
  deleteDatasetEntry,
  ensureRestrictedResourceAccess,
  getPodRoot,
  loadRegistryConfig,
} from "./solidCatalog";
import {
  normalizeRestrictedDatasetInput,
  publishRestrictedDataset,
  removeDataset,
} from "./catalogApi";

jest.mock("./solidCatalog", () => ({
  assertCatalogDatasetDeletionTarget: jest.fn(
    (_podRoot, datasetUrl) => datasetUrl
  ),
  createDataset: jest.fn(),
  deleteDatasetEntry: jest.fn(),
  ensureRestrictedResourceAccess: jest.fn(),
  getPodRoot: jest.fn(() => "https://pod.example/laura/"),
  loadRegistryConfig: jest.fn(),
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
  assertCatalogDatasetDeletionTarget.mockImplementation(
    (_podRoot, datasetUrl) => datasetUrl
  );
  getPodRoot.mockReturnValue("https://pod.example/laura/");
  ensureRestrictedResourceAccess.mockResolvedValue(undefined);
  loadRegistryConfig.mockResolvedValue({
    mode: "research",
    registries: ["https://registry.example/public/test"],
    privateRegistry: "",
  });
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
    input.distributionUrl,
    { podRoot: "https://pod.example/laura/" }
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

test("requires and binds a public registry for discoverable publication", async () => {
  await publishRestrictedDataset(session, {
    ...input,
    podRoot: "https://storage.example/alex/",
    distributionUrl:
      "https://storage.example/alex/solid-tours/runs/run-1/activity.geojson",
    requireDiscoverableRegistry: true,
  });

  expect(loadRegistryConfig).toHaveBeenCalledWith(
    session.info.webId,
    session.fetch,
    { podRoot: "https://storage.example/alex/" }
  );
  expect(createDataset).toHaveBeenCalledWith(
    session,
    expect.objectContaining({
      registryConfig: {
        mode: "research",
        registries: ["https://registry.example/public/test"],
        privateRegistry: "",
      },
    })
  );
});

test.each([
  { mode: "research", registries: [], privateRegistry: "" },
  {
    mode: "private",
    registries: [],
    privateRegistry: "https://storage.example/alex/registry/",
  },
])(
  "fails before ACL or Catalog writes without a discoverable public registry",
  async (registryConfig) => {
    loadRegistryConfig.mockResolvedValueOnce(registryConfig);

    await expect(
      publishRestrictedDataset(session, {
        ...input,
        requireDiscoverableRegistry: true,
      })
    ).rejects.toMatchObject({ code: "discoverable-registry-required" });
    expect(ensureRestrictedResourceAccess).not.toHaveBeenCalled();
    expect(createDataset).not.toHaveBeenCalled();
  }
);

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
    input.identifier,
    { podRoot: "https://pod.example/laura/" }
  );
});

test("removes a dataset idempotently from an identifier reference", async () => {
  const result = await removeDataset(session, { identifier: input.identifier });
  expect(assertCatalogDatasetDeletionTarget).toHaveBeenCalledWith(
    "https://pod.example/laura/",
    "https://pod.example/laura/catalog/ds/solid-tours-activity-run-1.ttl#it",
    input.identifier
  );
  expect(deleteDatasetEntry).toHaveBeenCalledWith(
    session,
    "https://pod.example/laura/catalog/ds/solid-tours-activity-run-1.ttl#it",
    input.identifier,
    { podRoot: "https://pod.example/laura/" }
  );
  expect(result.removed).toBe(true);
});

test("fails closed before deletion when the dataset target is outside the selected Pod catalog", async () => {
  assertCatalogDatasetDeletionTarget.mockImplementationOnce(() => {
    throw new Error("Unsafe catalog deletion target");
  });

  await expect(
    removeDataset(session, {
      identifier: input.identifier,
      datasetUrl: "https://pod.example/laura/private/notes.ttl#it",
    })
  ).rejects.toThrow("Unsafe catalog deletion target");
  expect(deleteDatasetEntry).not.toHaveBeenCalled();
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

test("publishes and removes metadata below an explicitly resolved external storage root", async () => {
  const podRoot = "https://storage.example/alex";
  const normalizedPodRoot = `${podRoot}/`;
  const externalInput = {
    ...input,
    podRoot,
    distributionUrl:
      "https://storage.example/alex/solid-tours/runs/run-1/activity.geojson",
  };
  createDataset.mockResolvedValueOnce({
    datasetUrl:
      "https://storage.example/alex/catalog/ds/solid-tours-activity-run-1.ttl#it",
    identifier: input.identifier,
  });

  const publication = await publishRestrictedDataset(session, externalInput);

  expect(getPodRoot).not.toHaveBeenCalled();
  expect(ensureRestrictedResourceAccess).toHaveBeenCalledWith(
    session,
    externalInput.distributionUrl,
    { podRoot: normalizedPodRoot }
  );
  expect(createDataset).toHaveBeenCalledWith(
    session,
    expect.objectContaining({ podRoot: normalizedPodRoot })
  );
  expect(publication).toMatchObject({
    datasetUrl:
      "https://storage.example/alex/catalog/ds/solid-tours-activity-run-1.ttl#it",
    recordUrl:
      "https://storage.example/alex/catalog/records/solid-tours-activity-run-1.ttl",
  });

  jest.clearAllMocks();
  deleteDatasetEntry.mockResolvedValue(undefined);
  const removal = await removeDataset(session, {
    identifier: input.identifier,
    podRoot,
  });
  expect(getPodRoot).not.toHaveBeenCalled();
  expect(deleteDatasetEntry).toHaveBeenCalledWith(
    session,
    "https://storage.example/alex/catalog/ds/solid-tours-activity-run-1.ttl#it",
    input.identifier,
    { podRoot: normalizedPodRoot }
  );
  expect(removal.datasetUrl).toBe(
    "https://storage.example/alex/catalog/ds/solid-tours-activity-run-1.ttl#it"
  );
});

test.each([
  "ftp://storage.example/alex/",
  "https://user:secret@storage.example/alex/",
  "https://storage.example/alex/?tenant=other",
  "https://storage.example/alex/#catalog",
  " https://storage.example/alex/",
])("rejects an unsafe Pod root %s", (podRoot) => {
  expect(() =>
    normalizeRestrictedDatasetInput(session, { ...input, podRoot })
  ).toThrow("Pod root must be an absolute HTTP(S) container URL.");
});
