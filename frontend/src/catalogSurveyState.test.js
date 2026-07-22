import {
  buildCatalogSurveyStorageKey,
  buildLegacyCatalogSurveyStorageKey,
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
const firstWebId = "https://pod.example/alice/profile/card#me";
const secondWebId = "https://pod.example/bob/profile/card#me";

const createStorage = () => {
  const values = new Map();
  return {
    getItem: jest.fn((key) => values.get(key) ?? null),
    setItem: jest.fn((key, value) => values.set(key, value)),
    removeItem: jest.fn((key) => values.delete(key)),
  };
};

describe("catalog survey browser state", () => {
  test("scopes participation by instance, version, question, and account", () => {
    const key = buildCatalogSurveyStorageKey({
      surveyEventsUrl,
      questionId,
      webId: firstWebId,
    });
    expect(key).toContain(encodeURIComponent(surveyEventsUrl));
    expect(key).toContain("catalog-usability-v1");
    expect(key).toContain(encodeURIComponent(firstWebId));
    expect(key).toContain(questionId);
    expect(buildCatalogSurveyStorageKey({
      surveyEventsUrl: surveyEventsUrl.replace("test", "dace"),
      questionId,
      webId: firstWebId,
    })).not.toBe(key);
    expect(buildCatalogSurveyStorageKey({
      surveyEventsUrl,
      questionId: CATALOG_SURVEY_QUESTION_IDS.datasetFindability,
      webId: firstWebId,
    })).not.toBe(key);
    expect(buildCatalogSurveyStorageKey({
      surveyEventsUrl,
      questionId,
      webId: secondWebId,
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
      webId: firstWebId,
      state,
    })).toBe(true);
    expect(readCatalogSurveyQuestionState({
      storage,
      surveyEventsUrl,
      questionId,
      webId: firstWebId,
    })).toEqual(state);
    expect(readCatalogSurveyQuestionState({
      storage,
      surveyEventsUrl,
      questionId,
      webId: secondWebId,
    })).toBeNull();
  });

  test("stores each submitted question independently", () => {
    const storage = createStorage();
    const first = { status: "submitted", eventId: "77b20b0f-e506-4e75-ac4c-5779a21c6f7a", occurredAt: "2026-07-22T08:00:00.000Z" };
    const second = { status: "submitted", eventId: "94b20b0f-e506-4e75-ac4c-5779a21c6f7a", occurredAt: "2026-07-22T08:01:00.000Z" };

    writeCatalogSurveyQuestionState({
      storage,
      surveyEventsUrl,
      questionId,
      webId: firstWebId,
      state: first,
    });
    writeCatalogSurveyQuestionState({
      storage,
      surveyEventsUrl,
      questionId: CATALOG_SURVEY_QUESTION_IDS.datasetFindability,
      webId: firstWebId,
      state: second,
    });

    expect(readCatalogSurveyQuestionState({
      storage,
      surveyEventsUrl,
      questionId,
      webId: firstWebId,
    })).toEqual(first);
    expect(readCatalogSurveyQuestionState({
      storage,
      surveyEventsUrl,
      questionId: CATALOG_SURVEY_QUESTION_IDS.datasetFindability,
      webId: firstWebId,
    })).toEqual(second);
  });

  test("discards browser-wide legacy markers instead of assigning them to an account", () => {
    const storage = createStorage();
    const legacyKey = buildLegacyCatalogSurveyStorageKey({ surveyEventsUrl, questionId });
    storage.setItem(legacyKey, JSON.stringify({
      status: "submitted",
      eventId: "77b20b0f-e506-4e75-ac4c-5779a21c6f7a",
      occurredAt: "2026-07-22T08:00:00.000Z",
    }));

    expect(readCatalogSurveyQuestionState({
      storage,
      surveyEventsUrl,
      questionId,
      webId: firstWebId,
    })).toBeNull();
    expect(storage.removeItem).toHaveBeenCalledWith(legacyKey);
    expect(readCatalogSurveyQuestionState({
      storage,
      surveyEventsUrl,
      questionId,
      webId: secondWebId,
    })).toBeNull();
  });

  test("ignores malformed local values", () => {
    const storage = createStorage();
    const key = buildCatalogSurveyStorageKey({
      surveyEventsUrl,
      questionId,
      webId: firstWebId,
    });
    storage.setItem(key, "not-json");
    expect(readCatalogSurveyQuestionState({
      storage,
      surveyEventsUrl,
      questionId,
      webId: firstWebId,
    })).toBeNull();
  });
});
