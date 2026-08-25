import { TextDecoder, TextEncoder } from "util";

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

const {
  createSolidDataset,
  createThing,
  setThing,
  setUrl,
} = require("@inrupt/solid-client");
const {
  getCatalogWebHref,
  getContactPointHref,
} = require("./catalogContact");
const { getSolidProfileEmail } = require("./solidProfileContact");

test("renders a WebID contact as a normal web link", () => {
  const webId = "https://pod.example/hannah/profile/card#me";
  expect(getContactPointHref(webId, "url")).toBe(webId);
});

test("renders a publisher WebID only as an HTTP link", () => {
  expect(getCatalogWebHref("https://pod.example/hannah/profile/card#me")).toBe(
    "https://pod.example/hannah/profile/card#me"
  );
  expect(getCatalogWebHref("javascript:alert(1)")).toBe("");
});

test("keeps existing email contacts as mailto links", () => {
  expect(getContactPointHref("hannah@example.org", "email")).toBe(
    "mailto:hannah@example.org"
  );
});

test("extracts a mailto IRI from a referenced vCard email Thing", () => {
  const webId = "https://pod.example/hannah/profile/card#me";
  const emailNodeUrl = "https://pod.example/hannah/profile/card#email-1";
  let profile = createThing({ url: webId });
  profile = setUrl(
    profile,
    "http://www.w3.org/2006/vcard/ns#hasEmail",
    emailNodeUrl
  );
  let emailNode = createThing({ url: emailNodeUrl });
  emailNode = setUrl(
    emailNode,
    "http://www.w3.org/2006/vcard/ns#value",
    "mailto:hannah@example.org"
  );
  let dataset = createSolidDataset();
  dataset = setThing(dataset, profile);
  dataset = setThing(dataset, emailNode);

  expect(getSolidProfileEmail(dataset, profile)).toBe("hannah@example.org");
});

test.each([
  "http://www.w3.org/2006/vcard/ns#hasEmail",
  "http://www.w3.org/2006/vcard/ns#email",
])("extracts a direct mailto IRI from %s", (predicate) => {
  const webId = "https://pod.example/alex/profile/card#me";
  let profile = createThing({ url: webId });
  profile = setUrl(profile, predicate, "mailto:alex@example.org");
  const dataset = setThing(createSolidDataset(), profile);

  expect(getSolidProfileEmail(dataset, profile)).toBe("alex@example.org");
});

test("does not invent an email when the profile value is missing or invalid", () => {
  const webId = "https://pod.example/alex/profile/card#me";
  let profile = createThing({ url: webId });
  profile = setUrl(
    profile,
    "http://www.w3.org/2006/vcard/ns#hasEmail",
    "https://pod.example/alex/profile/card#missing-email"
  );
  const dataset = setThing(createSolidDataset(), profile);

  expect(getSolidProfileEmail(dataset, profile)).toBe("");
});
