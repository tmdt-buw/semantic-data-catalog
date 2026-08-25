const httpContactUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch {
    return "";
  }
};

export const getCatalogWebHref = (value) => httpContactUrl(String(value || "").trim());

export const getContactPointHref = (value, type = "") => {
  const contact = String(value || "").trim();
  if (!contact) return "";
  const webUrl = getCatalogWebHref(contact);
  if (type === "url" || webUrl) return webUrl;
  if (type === "email" || (contact.includes("@") && !contact.includes(":"))) {
    return `mailto:${contact.replace(/^mailto:/, "")}`;
  }
  return "";
};
