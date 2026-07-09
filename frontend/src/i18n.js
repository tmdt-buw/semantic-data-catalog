import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export const SUPPORTED_LANGUAGES = ["en", "de"];
export const DEFAULT_LANGUAGE = "en";
export const LANGUAGE_STORAGE_KEY = "solid-dataspace.language";
export const LANGUAGE_EVENT = "solid-dataspace-language-change";
export const LANGUAGE_MESSAGE_TYPE = "solid-dataspace-language-change";

const enToDe = {
  Language: "Sprache",
  English: "Englisch",
  German: "Deutsch",
  Login: "Anmelden",
  Logout: "Abmelden",
  Save: "Speichern",
  Cancel: "Abbrechen",
  Close: "Schließen",
  Delete: "Löschen",
  Edit: "Bearbeiten",
  Search: "Suchen",
  Download: "Herunterladen",
  "Loading...": "Wird geladen...",
  "Checking profile": "Profil wird geprüft",
  "We are verifying your Solid profile and catalog configuration.":
    "Wir prüfen dein Solid-Profil und die Katalogkonfiguration.",
  "Semantic Data Catalog": "Semantischer Datenkatalog",
  "All datasets & dataset series": "Alle Datensätze und Datensatzreihen",
  "Add Dataset": "Datensatz hinzufügen",
  "Download Catalog": "Katalog herunterladen",
  "Private Registry": "Private Registry",
  "Manage private registry members": "Private Registry-Mitglieder verwalten",
  "Add a new dataset": "Neuen Datensatz hinzufügen",
  "Please log in to add datasets": "Bitte melde dich an, um Datensätze hinzuzufügen",
  "Search datasets...": "Datensätze suchen...",
  "Dataset": "Datensatz",
  "Datasets": "Datensätze",
  "Dataset Series": "Datensatzreihe",
  "Title": "Titel",
  "Description": "Beschreibung",
  "Theme": "Thema",
  "Publisher": "Herausgeber",
  "Contact point": "Kontaktstelle",
  "Access URL": "Zugriffs-URL",
  "Semantic model": "Semantisches Modell",
  "File format": "Dateiformat",
  "Public": "Öffentlich",
  "Private": "Privat",
  "Request access": "Zugriff anfragen",
  "Request Dataset": "Datensatz anfragen",
  "Access request sent": "Zugriffsanfrage gesendet",
  "Failed to build merged catalog download.": "Der zusammengeführte Katalog konnte nicht erstellt werden.",
  "Catalog downloads": "Katalog-Downloads",
  "Solid OIDC Login": "Solid-OIDC-Anmeldung",
  "Enter a valid OIDC issuer or Pod URL.": "Gib einen gültigen OIDC-Issuer oder eine Pod-URL ein.",
  "Back to provider list": "Zurück zur Anbieter-Liste",
  "Log in with selected provider": "Mit ausgewähltem Anbieter anmelden",
  "Suggested providers": "Vorgeschlagene Anbieter",
  "Custom issuer": "Eigener Issuer",
  Refresh: "Aktualisieren",
};

Object.assign(enToDe, {
  "Under Construction": "In Arbeit",
  "This section is not yet available.": "Dieser Bereich ist noch nicht verfügbar.",
  "Access Rights": "Zugriffsrechte",
  "Add External Link": "Externen Link hinzufügen",
  "Add Semantic Model File": "Semantische Modelldatei hinzufügen",
  "Browse files": "Dateien durchsuchen",
  "Create Semantic Model": "Semantisches Modell erstellen",
  "Dataset Resource": "Datensatz-Ressource",
  "Drag & drop": "Drag & Drop",
  "External Dataset link": "Externer Datensatzlink",
  "External link": "Externer Link",
  "General Information": "Allgemeine Informationen",
  "Issued Date": "Ausgabedatum",
  "Only TTL files are allowed.": "Nur TTL-Dateien sind erlaubt.",
  Optional: "Optional",
  "Pod owner": "Pod-Eigentümer",
  Remove: "Entfernen",
  "Remove Semantic Model": "Semantisches Modell entfernen",
  "Remove external link": "Externen Link entfernen",
  Restricted: "Eingeschränkt",
  "Save Dataset": "Datensatz speichern",
  Categories: "Kategorien",
  "Content: Dataset file": "Inhalt: Datensatzdatei",
  "Content: Semantic model": "Inhalt: Semantisches Modell",
  "Dataset owner": "Datensatz-Eigentümer",
  "Dataset resource": "Datensatz-Ressource",
  "Detail Dataset": "Datensatzdetails",
  "Download URL": "Download-URL",
  "Files and Sources": "Dateien und Quellen",
  "Format: Turtle/RDF model": "Format: Turtle/RDF-Modell",
  "No RDF triples found.": "Keine RDF-Tripel gefunden.",
  "No members listed.": "Keine Mitglieder gelistet.",
  Open: "Öffnen",
  "Open dataset": "Datensatz öffnen",
  "Request access to this dataset": "Zugriff auf diesen Datensatz anfragen",
  "Semantic Model Visualization": "Visualisierung des semantischen Modells",
  "Current Members": "Aktuelle Mitglieder",
  "Dataset link is required": "Datensatzlink ist erforderlich",
  "Edit Dataset": "Datensatz bearbeiten",
  "Save Changes": "Änderungen speichern",
  Members: "Mitglieder",
  "Restricted (You have access)": "Eingeschränkt (du hast Zugriff)",
  Catalog: "Katalog",
  Data: "Daten",
  "Login with Solid": "Mit Solid anmelden",
  "Not logged in": "Nicht angemeldet",
  Profile: "Profil",
  Semantic: "Semantik",
  "Choose Solid Pod Provider": "Solid-Pod-Anbieter auswählen",
  "Custom Issuer URL": "Eigene Issuer-URL",
  "Please select a provider or enter your own Solid OIDC Issuer:":
    "Wähle einen Anbieter aus oder gib deinen eigenen Solid-OIDC-Issuer ein:",
  Back: "Zurück",
  Next: "Weiter",
  Finish: "Abschließen",
  Basics: "Basisdaten",
  Email: "E-Mail",
  Name: "Name",
  Organization: "Organisation",
  Role: "Rolle",
  "Add at least one contact email.": "Füge mindestens eine Kontakt-E-Mail hinzu.",
  "Add email": "E-Mail hinzufügen",
  "Catalog URL": "Katalog-URL",
  "Complete these steps to activate your catalog access.":
    "Schließe diese Schritte ab, um deinen Katalogzugang zu aktivieren.",
  "Configure your Solid inbox, catalog, and private registry so access requests and metadata stay in your pod.":
    "Richte deine Solid-Inbox, deinen Katalog und deine private Registry ein, damit Zugriffsanfragen und Metadaten in deinem Pod bleiben.",
  "I understand that finishing will create and configure my catalog.":
    "Ich verstehe, dass beim Abschließen mein Katalog erstellt und konfiguriert wird.",
  "I understand that finishing will create and configure my inbox.":
    "Ich verstehe, dass beim Abschließen meine Inbox erstellt und konfiguriert wird.",
  "I understand that finishing will create and configure my private registry.":
    "Ich verstehe, dass beim Abschließen meine private Registry erstellt und konfiguriert wird.",
  "Inbox URL": "Inbox-URL",
  "Inbox, Catalog & Registry": "Inbox, Katalog und Registry",
  "No photo": "Kein Foto",
  "Please provide your profile basics.": "Bitte gib deine grundlegenden Profildaten an.",
});

Object.assign(enToDe, {
  "Semantic Model File": "Semantische Modelldatei",
  "Series title is required": "Titel der Reihe ist erforderlich",
  "Upload file": "Datei hochladen",
  "Series Description": "Beschreibung der Reihe",
  "Series Members (Existing Datasets)": "Reihenmitglieder (bestehende Datensätze)",
  "Series Theme (IRI)": "Reihenthema (IRI)",
  "Series Title": "Titel der Reihe",
  "your file here": "deine Datei hier",
  "Preparing your profile...": "Dein Profil wird vorbereitet...",
  "Welcome to the Semantic Data Catalog": "Willkommen im Semantic Data Catalog",
  "Profile avatar": "Profilavatar",
  "Upload profile photo": "Profilfoto hochladen",
  "Upload profile photo (optional)": "Profilfoto hochladen (optional)",
  "Uploading...": "Wird hochgeladen...",
  "Solid Inbox, Catalog & Registry": "Solid-Inbox, Katalog und Registry",
  "The inbox will be created in a": "Die Inbox wird in einem",
  "The catalog metadata will be created in a":
    "Die Katalog-Metadaten werden in einem",
  "The registry will always be created in your pod root under":
    "Die Registry wird immer in deinem Pod-Root unter",
  "container in your pod.": "Container in deinem Pod erstellt.",
  Folder: "Ordner",
  "Create Folder": "Ordner erstellen",
  "Folder name": "Ordnername",
  "Folder name is required.": "Ordnername ist erforderlich.",
  "Folder name cannot contain /, \\, #, or ?.":
    "Ordnernamen dürfen /, \\, # oder ? nicht enthalten.",
  "Loading folders...": "Ordner werden geladen...",
  "New Folder": "Neuer Ordner",
  "No Solid Pod is available.": "Kein Solid-Pod verfügbar.",
  "No subfolders in this folder.": "Keine Unterordner in diesem Ordner.",
  "No matching files in this folder.": "Keine passenden Dateien in diesem Ordner.",
  "Pod root": "Pod-Wurzel",
  "Search files...": "Dateien suchen...",
  "Creating...": "Wird erstellt...",
  "Add WebID": "WebID hinzufügen",
  "Loading registry members...": "Registry-Mitglieder werden geladen...",
  "Members (WebIDs)": "Mitglieder (WebIDs)",
  "No WebIDs added yet.": "Noch keine WebIDs hinzugefügt.",
  "Registry URL": "Registry-URL",
  "Remove WebID": "WebID entfernen",
  "This registry is stored in your pod under":
    "Diese Registry wird in deinem Pod gespeichert unter",
  "Request Access": "Zugriff anfragen",
  "Request Dataset Access": "Datensatzzugriff anfragen",
  "Required message...": "Erforderliche Nachricht...",
  "To submit a request, please include a short background explaining why you need this dataset.":
    "Füge für die Anfrage bitte kurz hinzu, warum du diesen Datensatz benötigst.",
  "Your request will be delivered to the owner&apos;s Solid inbox and handled in the Solid Dataspace Manager.":
    "Deine Anfrage wird an die Solid-Inbox des Eigentümers zugestellt und im Solid Dataspace Manager bearbeitet.",
  "Your request will be delivered to the owner's Solid inbox and handled in the Solid Dataspace Manager.":
    "Deine Anfrage wird an die Solid-Inbox des Eigentümers zugestellt und im Solid Dataspace Manager bearbeitet.",
});

const deToEn = Object.entries(enToDe).reduce((acc, [en, de]) => {
  acc[de] = en;
  return acc;
}, {});

function withOriginalWhitespace(original, translated) {
  const leading = original.match(/^\s*/)?.[0] || "";
  const trailing = original.match(/\s*$/)?.[0] || "";
  return `${leading}${translated}${trailing}`;
}

export function normalizeLanguage(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized.startsWith("de")) return "de";
  if (normalized.startsWith("en")) return "en";
  return DEFAULT_LANGUAGE;
}

function getLanguageFromUrl() {
  if (typeof window === "undefined") return "";
  try {
    const params = new URLSearchParams(window.location.search);
    const value = params.get("lang") || params.get("language");
    return value ? normalizeLanguage(value) : "";
  } catch {
    return "";
  }
}

function getLanguageFromHostBridge() {
  if (typeof window === "undefined" || window.parent === window) return "";
  try {
    if (window.parent.location.origin !== window.location.origin) return "";
    const value = window.parent.__SOLID_DATASPACE_AUTH__?.getLanguage?.();
    return value ? normalizeLanguage(value) : "";
  } catch {
    return "";
  }
}

function readStoredLanguage() {
  if (typeof window === "undefined") return "";
  try {
    const value = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return value ? normalizeLanguage(value) : "";
  } catch {
    return "";
  }
}

function writeStoredLanguage(language) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizeLanguage(language));
  } catch {
    // Ignore storage failures.
  }
}

function resolveInitialLanguage() {
  return (
    getLanguageFromUrl() ||
    getLanguageFromHostBridge() ||
    readStoredLanguage() ||
    DEFAULT_LANGUAGE
  );
}

export function translateText(value, language) {
  if (typeof value !== "string" || !value.trim()) return value;
  const body = value.trim();
  const target = normalizeLanguage(language);
  if (target === "de") {
    return enToDe[body] ? withOriginalWhitespace(value, enToDe[body]) : value;
  }
  return deToEn[body] ? withOriginalWhitespace(value, deToEn[body]) : value;
}

function translateNode(node, language) {
  if (!node) return;
  if (node.nodeType === Node.TEXT_NODE) {
    const next = translateText(node.nodeValue || "", language);
    if (next !== node.nodeValue) node.nodeValue = next;
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  if (["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA"].includes(node.tagName)) {
    return;
  }
  ["title", "placeholder", "aria-label", "alt"].forEach((name) => {
    if (!node.hasAttribute?.(name)) return;
    const current = node.getAttribute(name);
    const next = translateText(current, language);
    if (next !== current) node.setAttribute(name, next);
  });
  node.childNodes.forEach((child) => translateNode(child, language));
}

function applyDocumentTranslations(language) {
  if (typeof document === "undefined" || !document.body) return;
  document.documentElement.lang = normalizeLanguage(language);
  translateNode(document.body, language);
}

function installDomTranslator(getLanguage) {
  if (typeof document === "undefined" || typeof MutationObserver === "undefined") {
    return () => {};
  }
  let scheduled = false;
  const run = () => {
    scheduled = false;
    applyDocumentTranslations(getLanguage());
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(run);
  };
  const observer = new MutationObserver(schedule);
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["title", "placeholder", "aria-label", "alt"],
    });
    schedule();
  }
  return () => observer.disconnect();
}

function publishLanguage(language) {
  if (typeof window === "undefined") return;
  const normalized = normalizeLanguage(language);
  writeStoredLanguage(normalized);
  window.dispatchEvent(new CustomEvent(LANGUAGE_EVENT, { detail: { language: normalized } }));
  try {
    window.parent?.postMessage({ type: LANGUAGE_MESSAGE_TYPE, language: normalized }, "*");
  } catch {
    // Ignore cross-window failures.
  }
  try {
    window.parent?.__SOLID_DATASPACE_AUTH__?.setLanguage?.(normalized);
  } catch {
    // Ignore bridge failures.
  }
}

function subscribeLanguage(callback) {
  if (typeof window === "undefined") return () => {};
  const handleEvent = (event) => callback(normalizeLanguage(event?.detail?.language));
  const handleStorage = (event) => {
    if (event.key === LANGUAGE_STORAGE_KEY && event.newValue) {
      callback(normalizeLanguage(event.newValue));
    }
  };
  const handleMessage = (event) => {
    const data = event.data || {};
    if (data.type === LANGUAGE_MESSAGE_TYPE && data.language) {
      callback(normalizeLanguage(data.language));
    }
  };
  let unsubscribeBridge;
  try {
    unsubscribeBridge = window.parent?.__SOLID_DATASPACE_AUTH__?.subscribeLanguage?.(callback);
  } catch {
    unsubscribeBridge = undefined;
  }
  window.addEventListener(LANGUAGE_EVENT, handleEvent);
  window.addEventListener("storage", handleStorage);
  window.addEventListener("message", handleMessage);
  return () => {
    window.removeEventListener(LANGUAGE_EVENT, handleEvent);
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("message", handleMessage);
    unsubscribeBridge?.();
  };
}

const I18nContext = createContext({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  t: (value) => value,
});

export function I18nProvider({ children, language: controlledLanguage }) {
  const [internalLanguage, setInternalLanguage] = useState(resolveInitialLanguage);
  const language = normalizeLanguage(controlledLanguage || internalLanguage);
  const languageRef = useRef(language);
  languageRef.current = language;

  const setLanguage = useCallback(
    (nextLanguage) => {
      const normalized = normalizeLanguage(nextLanguage);
      if (!controlledLanguage) setInternalLanguage(normalized);
      publishLanguage(normalized);
    },
    [controlledLanguage]
  );

  useEffect(() => {
    applyDocumentTranslations(language);
  }, [language]);

  useEffect(() => installDomTranslator(() => languageRef.current), []);

  useEffect(
    () =>
      subscribeLanguage((nextLanguage) => {
        if (nextLanguage === languageRef.current) return;
        if (!controlledLanguage) setInternalLanguage(nextLanguage);
      }),
    [controlledLanguage]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key) => translateText(key, language),
    }),
    [language, setLanguage]
  );

  return React.createElement(I18nContext.Provider, { value }, children);
}

export function useI18n() {
  return useContext(I18nContext);
}

export function LanguageSelect({ className = "", compact = false, label = "" } = {}) {
  const { language, setLanguage, t } = useI18n();
  return React.createElement(
    "label",
    { className: `language-select ${className}`.trim() },
    !compact &&
      React.createElement(
        "span",
        { className: "language-select__label" },
        label || t("Language")
      ),
    React.createElement(
      "select",
      {
        value: language,
        onChange: (event) => setLanguage(event.target.value),
        "aria-label": t("Language"),
        title: t("Language"),
      },
      React.createElement(
        "option",
        { value: "en" },
        language === "de" ? "Englisch" : "English"
      ),
      React.createElement("option", { value: "de" }, "Deutsch")
    )
  );
}
