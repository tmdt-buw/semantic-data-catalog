import { TextDecoder, TextEncoder } from "util";

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

const mockGetSolidDataset = jest.fn();
const mockSaveSolidDatasetAt = jest.fn();
const mockDeleteFile = jest.fn();

jest.mock("@inrupt/solid-client", () => {
  const actual = jest.requireActual("@inrupt/solid-client");
  return {
    ...actual,
    getSolidDataset: (...args) => mockGetSolidDataset(...args),
    saveSolidDatasetAt: (...args) => mockSaveSolidDatasetAt(...args),
    deleteFile: (...args) => mockDeleteFile(...args),
  };
});

const {
  createSolidDataset,
  createThing,
  getThing,
  getUrl,
  getUrlAll,
  setStringNoLocale,
  setThing,
  setUrl,
} = require("@inrupt/solid-client");
const {
  assertCatalogDatasetDeletionTarget,
  buildDefaultPrivateRegistry,
  deleteDatasetEntry,
  loadRegistryConfig,
  saveRegistryConfig,
} = require("./solidCatalog");

const WEB_ID = "https://identity.example/users/alex#me";
const POD_ROOT = "https://storage.example/alex/";
const PROFILE_DOC = "https://identity.example/users/alex";
const REGISTRY_MODE = "https://w3id.org/solid-dataspace-manager#registryMode";
const REGISTRY = "https://w3id.org/solid-dataspace-manager#registry";
const PRIVATE_REGISTRY =
  "https://w3id.org/solid-dataspace-manager#privateRegistry";
const PUBLIC_REGISTRY = "https://registry.example/public/research";

const profileDataset = ({ mode = "research", registries = [], privateRegistry = "" } = {}) => {
  let profile = createThing({ url: WEB_ID });
  profile = setStringNoLocale(profile, REGISTRY_MODE, mode);
  registries.forEach((registryUrl) => {
    profile = setUrl(profile, REGISTRY, registryUrl);
  });
  if (privateRegistry) profile = setUrl(profile, PRIVATE_REGISTRY, privateRegistry);
  return setThing(createSolidDataset(), profile);
};

beforeEach(() => {
  jest.clearAllMocks();
  mockSaveSolidDatasetAt.mockResolvedValue(undefined);
});

test("accepts only the exact direct dataset document selected for deletion", () => {
  const identifier = "solid-tours-activity-run-1";
  const expected = `${POD_ROOT}catalog/ds/${identifier}.ttl#it`;

  expect(
    assertCatalogDatasetDeletionTarget(POD_ROOT, expected, identifier)
  ).toBe(expected);
  expect(
    assertCatalogDatasetDeletionTarget(POD_ROOT, expected)
  ).toBe(expected);
});

test.each([
  ["outside the catalog", `${POD_ROOT}private/notes.ttl#it`, "notes"],
  ["outside the Pod", "https://other.example/catalog/ds/tours.ttl#it", "tours"],
  ["nested below ds", `${POD_ROOT}catalog/ds/archive/tours.ttl#it`, "tours"],
  ["with a mismatched identifier", `${POD_ROOT}catalog/ds/other.ttl#it`, "tours"],
  ["without the dataset fragment", `${POD_ROOT}catalog/ds/tours.ttl`, "tours"],
  ["with a query", `${POD_ROOT}catalog/ds/tours.ttl?delete=true#it`, "tours"],
])("rejects a deletion target %s", (_label, datasetUrl, identifier) => {
  expect(() =>
    assertCatalogDatasetDeletionTarget(POD_ROOT, datasetUrl, identifier)
  ).toThrow("Dataset URL must identify a direct catalog/ds");
});

test("deleteDatasetEntry rejects an unsafe target before Pod reads or deletes", async () => {
  const session = { info: { webId: WEB_ID }, fetch: jest.fn() };

  await expect(
    deleteDatasetEntry(
      session,
      `${POD_ROOT}private/notes.ttl#it`,
      "notes",
      { podRoot: POD_ROOT }
    )
  ).rejects.toThrow("Dataset URL must identify a direct catalog/ds");
  expect(session.fetch).not.toHaveBeenCalled();
  expect(mockGetSolidDataset).not.toHaveBeenCalled();
  expect(mockDeleteFile).not.toHaveBeenCalled();
});

test("uses the resolved Pod root for every default private-registry fallback", async () => {
  mockGetSolidDataset.mockResolvedValueOnce(profileDataset({ mode: "private" }));

  expect(buildDefaultPrivateRegistry(WEB_ID, POD_ROOT)).toBe(
    `${POD_ROOT}registry/`
  );
  await expect(
    loadRegistryConfig(WEB_ID, jest.fn(), { podRoot: POD_ROOT })
  ).resolves.toMatchObject({
    mode: "private",
    privateRegistry: `${POD_ROOT}registry/`,
  });
});

test("saveRegistryConfig keeps public registries unchanged while defaulting private storage to podRoot", async () => {
  const current = profileDataset();
  mockGetSolidDataset.mockResolvedValueOnce(current);
  const fetch = jest.fn();

  await saveRegistryConfig(
    WEB_ID,
    fetch,
    { mode: "research", registries: [PUBLIC_REGISTRY] },
    { podRoot: POD_ROOT }
  );

  expect(mockGetSolidDataset).toHaveBeenCalledWith(PROFILE_DOC, { fetch });
  expect(mockSaveSolidDatasetAt).toHaveBeenCalledTimes(1);
  const [, savedProfile, options] = mockSaveSolidDatasetAt.mock.calls[0];
  const profile = getThing(savedProfile, WEB_ID);
  expect(getUrlAll(profile, REGISTRY)).toEqual([PUBLIC_REGISTRY]);
  expect(getUrl(profile, PRIVATE_REGISTRY)).toBe(`${POD_ROOT}registry/`);
  expect(options).toEqual({ fetch });
});
