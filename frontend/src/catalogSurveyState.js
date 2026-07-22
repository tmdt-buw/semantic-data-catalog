import { CATALOG_SURVEY_VERSION } from "./statistics";

const STORAGE_PREFIX = "semantic-data-catalog:survey";
const VALID_STATUSES = new Set(["pending", "submitted"]);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const buildCatalogSurveyStorageKey = ({
  surveyEventsUrl,
  questionId,
  surveyVersion = CATALOG_SURVEY_VERSION,
} = {}) => {
  const endpoint = String(surveyEventsUrl || "").trim();
  const question = String(questionId || "").trim();
  const version = String(surveyVersion || "").trim();
  if (!endpoint || !question || !version) return "";
  return `${STORAGE_PREFIX}:${encodeURIComponent(endpoint)}:${encodeURIComponent(version)}:${encodeURIComponent(question)}`;
};

export const readCatalogSurveyQuestionState = ({
  storage,
  surveyEventsUrl,
  questionId,
  surveyVersion = CATALOG_SURVEY_VERSION,
} = {}) => {
  const key = buildCatalogSurveyStorageKey({ surveyEventsUrl, questionId, surveyVersion });
  if (!key || !storage?.getItem) return null;

  try {
    const value = JSON.parse(storage.getItem(key) || "null");
    if (!value || !VALID_STATUSES.has(value.status)) return null;
    if (value.status === "submitted") {
      return UUID_PATTERN.test(String(value.eventId || "")) ? value : null;
    }
    const event = value.event;
    if (
      !UUID_PATTERN.test(String(event?.eventId || "")) ||
      event.questionId !== questionId ||
      event.surveyVersion !== surveyVersion ||
      !Number.isInteger(event.rating) ||
      event.rating < 1 ||
      event.rating > 5
    ) {
      return null;
    }
    return value;
  } catch {
    return null;
  }
};

export const writeCatalogSurveyQuestionState = ({
  storage,
  surveyEventsUrl,
  questionId,
  surveyVersion = CATALOG_SURVEY_VERSION,
  state,
} = {}) => {
  const key = buildCatalogSurveyStorageKey({ surveyEventsUrl, questionId, surveyVersion });
  if (!key || !storage?.setItem || !state || !VALID_STATUSES.has(state.status)) return false;
  try {
    storage.setItem(key, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
};
