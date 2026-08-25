import { getThing, getUrl, getUrlAll } from "@inrupt/solid-client";
import { VCARD } from "@inrupt/vocab-common-rdf";

export const normalizeSolidProfileEmail = (value) => {
  const normalized = String(value || "").trim().replace(/^mailto:/i, "");
  if (!normalized || normalized.includes(":") || /\s/.test(normalized)) return "";
  const at = normalized.indexOf("@");
  if (at <= 0 || at !== normalized.lastIndexOf("@") || at === normalized.length - 1) {
    return "";
  }
  return normalized;
};

export const getSolidProfileEmail = (profileDataset, profile) => {
  if (!profileDataset || !profile) return "";

  for (const emailReference of getUrlAll(profile, VCARD.hasEmail) || []) {
    if (emailReference.toLowerCase().startsWith("mailto:")) {
      const email = normalizeSolidProfileEmail(emailReference);
      if (email) return email;
      continue;
    }

    const emailThing = getThing(profileDataset, emailReference);
    const email = emailThing
      ? normalizeSolidProfileEmail(getUrl(emailThing, VCARD.value) || "")
      : "";
    if (email) return email;
  }

  for (const directEmail of getUrlAll(profile, VCARD.email) || []) {
    const email = normalizeSolidProfileEmail(directEmail);
    if (email) return email;
  }

  return "";
};
