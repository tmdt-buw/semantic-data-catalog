import { TextDecoder, TextEncoder } from "util";

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

const {
  createSolidDataset,
  getThing,
  getUrl,
  getUrlAll,
  setThing,
  setUrl,
} = require("@inrupt/solid-client");
const { DCAT, DCTERMS, RDF, VCARD } = require("@inrupt/vocab-common-rdf");
const {
  buildContactThing,
  buildDatasetResource,
  buildPublisherThing,
  parseDatasetFromDoc,
} = require("./solidCatalog");

test("writes and parses a WebID-backed vCard contact without inventing an email", () => {
  const datasetDocUrl = "https://pod.example/hannah/catalog/ds/tours.ttl";
  const datasetUrl = `${datasetDocUrl}#it`;
  const webId = "https://pod.example/hannah/profile/card#me";
  const input = {
    identifier: "tours",
    title: "Completed tours health-data donation",
    description: "Restricted routes and summaries",
    issued: "2026-08-21T12:00:00.000Z",
    publisher: "Hannah Müller",
    publisher_url: webId,
    contact_point: "",
    contact_url: webId,
    webid: webId,
    is_public: false,
  };

  let datasetThing = buildDatasetResource(datasetDocUrl, input);
  const contactThing = buildContactThing(datasetDocUrl, input);
  const publisherThing = buildPublisherThing(input);
  datasetThing = setUrl(datasetThing, DCAT.contactPoint, contactThing.url);
  let dataset = createSolidDataset();
  dataset = setThing(dataset, contactThing);
  dataset = setThing(dataset, publisherThing);
  dataset = setThing(dataset, datasetThing);

  expect(getUrl(datasetThing, DCAT.contactPoint)).toBe(`${datasetDocUrl}#contact`);
  expect(getUrl(datasetThing, DCTERMS.publisher)).toBe(webId);
  expect(getUrl(datasetThing, DCTERMS.creator)).toBe(webId);
  expect(getUrlAll(contactThing, RDF.type)).toContain(VCARD.Individual);
  expect(getUrl(contactThing, VCARD.hasURL)).toBe(webId);
  expect(getUrl(contactThing, VCARD.hasEmail)).toBeNull();

  const parsed = parseDatasetFromDoc(dataset, datasetUrl);
  expect(parsed).toMatchObject({
    publisher: "Hannah Müller",
    publisher_url: webId,
    contact_point: webId,
    contact_point_type: "url",
    webid: webId,
  });
  expect(getThing(dataset, `${datasetDocUrl}#contact`)).not.toBeNull();
});

test("writes the profile email as the vCard contact while keeping creator as the WebID", () => {
  const datasetDocUrl = "https://pod.example/hannah/catalog/ds/tours.ttl";
  const datasetUrl = `${datasetDocUrl}#it`;
  const webId = "https://pod.example/hannah/profile/card#me";
  const email = "hannah.mueller@sscon-praesentation.de";
  const input = {
    identifier: "tours",
    title: "Completed tours health-data donation",
    description: "Restricted routes and summaries",
    issued: "2026-08-21T12:00:00.000Z",
    publisher: "Hannah Müller",
    publisher_url: webId,
    contact_point: email,
    contact_url: "",
    webid: webId,
    is_public: false,
  };

  let datasetThing = buildDatasetResource(datasetDocUrl, input);
  const contactThing = buildContactThing(datasetDocUrl, input);
  const publisherThing = buildPublisherThing(input);
  datasetThing = setUrl(datasetThing, DCAT.contactPoint, contactThing.url);
  let dataset = createSolidDataset();
  dataset = setThing(dataset, contactThing);
  dataset = setThing(dataset, publisherThing);
  dataset = setThing(dataset, datasetThing);

  expect(getUrl(contactThing, VCARD.hasEmail)).toBe(`mailto:${email}`);
  expect(getUrl(contactThing, VCARD.hasURL)).toBeNull();
  expect(getUrl(datasetThing, DCTERMS.creator)).toBe(webId);
  expect(getUrl(datasetThing, DCAT.contactPoint)).toBe(`${datasetDocUrl}#contact`);
  expect(parseDatasetFromDoc(dataset, datasetUrl)).toMatchObject({
    publisher: "Hannah Müller",
    publisher_url: webId,
    contact_point: email,
    contact_point_type: "email",
    webid: webId,
  });
});
