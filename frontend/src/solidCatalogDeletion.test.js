import { deleteCatalogDatasetDocuments } from "./catalogDeletion";

const datasetDocUrl = "https://pod.example/laura/catalog/ds/activity.ttl";
const recordDocUrl = "https://pod.example/laura/catalog/records/activity.ttl";
const fetch = jest.fn();

const deletion = (deleteResource) =>
  deleteCatalogDatasetDocuments({
    datasetDocUrl,
    recordDocUrl,
    fetch,
    deleteResource,
  });

test("reports a transient dataset deletion failure after still attempting the record", async () => {
  const transient = Object.assign(new Error("Pod unavailable"), { statusCode: 503 });
  const deleteResource = jest
    .fn()
    .mockRejectedValueOnce(transient)
    .mockResolvedValueOnce(undefined);

  await expect(deletion(deleteResource)).rejects.toMatchObject({
    name: "AggregateError",
    failures: [
      expect.objectContaining({
        label: "dataset document",
        url: datasetDocUrl,
        status: 503,
      }),
    ],
  });
  expect(deleteResource).toHaveBeenNthCalledWith(1, datasetDocUrl, { fetch });
  expect(deleteResource).toHaveBeenNthCalledWith(2, recordDocUrl, { fetch });
});

test("reports a transient record deletion failure after deleting the dataset", async () => {
  const transient = Object.assign(new Error("Record locked"), {
    response: { status: 409 },
  });
  const deleteResource = jest
    .fn()
    .mockResolvedValueOnce(undefined)
    .mockRejectedValueOnce(transient);

  await expect(deletion(deleteResource)).rejects.toMatchObject({
    name: "AggregateError",
    failures: [
      expect.objectContaining({
        label: "catalog record",
        url: recordDocUrl,
        status: 409,
      }),
    ],
  });
  expect(deleteResource).toHaveBeenCalledTimes(2);
});

test("allows a reset retry when a previous partial attempt already deleted a resource", async () => {
  const alreadyDeleted = Object.assign(new Error("Not found"), { statusCode: 404 });
  const deleteResource = jest
    .fn()
    .mockRejectedValueOnce(alreadyDeleted)
    .mockResolvedValueOnce(undefined);

  await expect(deletion(deleteResource)).resolves.toBeUndefined();
  expect(deleteResource).toHaveBeenCalledTimes(2);
});

test("aggregates simultaneous dataset and record failures", async () => {
  const deleteResource = jest
    .fn()
    .mockRejectedValueOnce(Object.assign(new Error("Dataset failed"), { status: 500 }))
    .mockRejectedValueOnce(Object.assign(new Error("Record failed"), { status: 502 }));

  await expect(deletion(deleteResource)).rejects.toMatchObject({
    name: "AggregateError",
    errors: expect.arrayContaining([
      expect.objectContaining({ message: "Dataset failed" }),
      expect.objectContaining({ message: "Record failed" }),
    ]),
    failures: [
      expect.objectContaining({ label: "dataset document", status: 500 }),
      expect.objectContaining({ label: "catalog record", status: 502 }),
    ],
  });
});
