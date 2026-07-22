import {
  buildCatalogSurveyStorageKey,
  readCatalogSurveyQuestionState,
  writeCatalogSurveyQuestionState,
} from "./catalogSurveyState";
import {
  CATALOG_SURFACES,
  CATALOG_SURVEY_QUESTION_IDS,
  createCatalogSurveyEvent,
} from "./statistics";

const surveyEventsUrl =
  "https://stats.example/statistics/events/catalog-instances/test/survey-responses/";
const questionId = CATALOG_SURVEY_QUESTION_IDS.systemComprehensibility;

const createStorage = () => {
  const values = new Map();
  return {
    getItem: jest.fn((key) => values.get(key) ?? null),
    setItem: jest.fn((key, value) => values.set(key, value)),
  };
};

describe("catalog survey browser state", () => {
  test("scopes participation by instance, version, and question", () => {
    const key = buildCatalogSurveyStorageKey({ surveyEventsUrl, questionId });
    expect(key).toContain(encodeURIComponent(surveyEventsUrl));
    expect(key).toContain("catalog-usability-v1");
    expect(key).toContain(questionId);
    expect(buildCatalogSurveyStorageKey({
      surveyEventsUrl: surveyEventsUrl.replace("test", "dace"),
      questionId,
    })).not.toBe(key);
    expect(buildCatalogSurveyStorageKey({
      surveyEventsUrl,
      questionId: CATALOG_SURVEY_QUESTION_IDS.datasetFindability,
    })).not.toBe(key);
  });

  test("keeps a pending event stable for a retry", () => {
    const storage = createStorage();
    const event = createCatalogSurveyEvent({
      questionId,
      rating: 2,
      catalogSurface: CATALOG_SURFACES.embedded,
      eventId: "77b20b0f-e506-4e75-ac4c-5779a21c6f7a",
      occurredAt: "2026-07-22T08:09:10.000Z",
    });
    const state = { status: "pending", event };

    expect(writeCatalogSurveyQuestionState({
      storage,
      surveyEventsUrl,
      questionId,
      state,
    })).toBe(true);
    expect(readCatalogSurveyQuestionState({ storage, surveyEventsUrl, questionId })).toEqual(state);
  });

  test("stores each submitted question independently", () => {
    const storage = createStorage();
    const first = { status: "submitted", eventId: "77b20b0f-e506-4e75-ac4c-5779a21c6f7a", occurredAt: "2026-07-22T08:00:00.000Z" };
    const second = { status: "submitted", eventId: "94b20b0f-e506-4e75-ac4c-5779a21c6f7a", occurredAt: "2026-07-22T08:01:00.000Z" };

    writeCatalogSurveyQuestionState({ storage, surveyEventsUrl, questionId, state: first });
    writeCatalogSurveyQuestionState({
      storage,
      surveyEventsUrl,
      questionId: CATALOG_SURVEY_QUESTION_IDS.datasetFindability,
      state: second,
    });

    expect(readCatalogSurveyQuestionState({ storage, surveyEventsUrl, questionId })).toEqual(first);
    expect(readCatalogSurveyQuestionState({
      storage,
      surveyEventsUrl,
      questionId: CATALOG_SURVEY_QUESTION_IDS.datasetFindability,
    })).toEqual(second);
  });

  test("ignores malformed local values", () => {
    const storage = createStorage();
    const key = buildCatalogSurveyStorageKey({ surveyEventsUrl, questionId });
    storage.setItem(key, "not-json");
    expect(readCatalogSurveyQuestionState({ storage, surveyEventsUrl, questionId })).toBeNull();
  });
});
