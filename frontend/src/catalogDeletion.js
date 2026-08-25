const isNotFound = (error) =>
  error?.statusCode === 404 ||
  error?.status === 404 ||
  error?.response?.status === 404 ||
  error?.response?.statusCode === 404;

export const deleteCatalogDatasetDocuments = async ({
  datasetDocUrl,
  recordDocUrl = "",
  fetch,
  deleteResource,
}) => {
  const targets = [
    { label: "dataset document", url: datasetDocUrl },
    ...(recordDocUrl ? [{ label: "catalog record", url: recordDocUrl }] : []),
  ];
  const failures = [];

  for (const target of targets) {
    try {
      await deleteResource(target.url, { fetch });
    } catch (error) {
      // A previous partial reset may already have removed this resource. Treating
      // 404 as success makes the operation safe to retry without hiding real
      // authorization, availability, or server failures.
      if (!isNotFound(error)) failures.push({ ...target, error });
    }
  }

  if (failures.length) {
    const detail = failures.map(({ label, url }) => `${label} (${url})`).join(", ");
    const error = new AggregateError(
      failures.map((failure) => failure.error),
      `Catalog dataset deletion incomplete: ${detail}.`
    );
    error.failures = failures.map(({ label, url, error: cause }) => ({
      label,
      url,
      status:
        cause?.statusCode ||
        cause?.status ||
        cause?.response?.status ||
        cause?.response?.statusCode ||
        null,
    }));
    throw error;
  }
};
