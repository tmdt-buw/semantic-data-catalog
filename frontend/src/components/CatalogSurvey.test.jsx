import React, { act } from "react";
import { createRoot } from "react-dom/client";
import CatalogSurvey from "./CatalogSurvey";
import { translateText } from "../i18n";
import {
  CATALOG_SURFACES,
  CATALOG_SURVEY_QUESTION_IDS,
  recordCatalogSurveyResponse,
} from "../statistics";

jest.mock("../statistics", () => ({
  ...jest.requireActual("../statistics"),
  recordCatalogSurveyResponse: jest.fn(),
}));

const canonicalConfig = {
  enabled: true,
  eventsUrl: "https://stats.example/statistics/events/catalog-instances/test/downloads/",
};

const authenticatedSession = {
  info: { isLoggedIn: true },
  fetch: jest.fn(),
};

const renderSurvey = async (props = {}) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(
      <CatalogSurvey
        session={authenticatedSession}
        statisticsConfig={canonicalConfig}
        catalogSurface={CATALOG_SURFACES.embedded}
        authenticated
        {...props}
      />
    );
    await Promise.resolve();
  });
  return {
    container,
    async unmount() {
      await act(async () => root.unmount());
      container.remove();
    },
  };
};

const click = async (element) => {
  await act(async () => {
    element.click();
    await Promise.resolve();
  });
};

const buttonWithText = (container, text) =>
  Array.from(container.querySelectorAll("button")).find(
    (button) => button.textContent.trim() === text
  );

describe("CatalogSurvey", () => {
  beforeAll(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
  });

  beforeEach(() => {
    window.localStorage.clear();
    recordCatalogSurveyResponse.mockReset();
    authenticatedSession.fetch.mockReset();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("is visible only for an authenticated canonical statistics configuration", async () => {
    const anonymous = await renderSurvey({ authenticated: false });
    expect(anonymous.container.querySelector(".catalog-survey-launcher")).toBeNull();
    await anonymous.unmount();

    const legacy = await renderSurvey({
      statisticsConfig: {
        enabled: true,
        eventsUrl: "https://stats.example/statistics/events/downloads/",
      },
    });
    expect(legacy.container.querySelector(".catalog-survey-launcher")).toBeNull();
    await legacy.unmount();

    const available = await renderSurvey();
    expect(available.container.querySelector(".catalog-survey-launcher")).not.toBeNull();
    await available.unmount();
  });

  test("uses monochrome Font Awesome icons instead of Unicode emoji", async () => {
    const view = await renderSurvey();

    expect(
      view.container.querySelector(".catalog-survey-launcher svg[data-icon='comment-dots']")
    ).not.toBeNull();
    await click(view.container.querySelector(".catalog-survey-launcher"));

    const ratingIcons = Array.from(
      view.container.querySelectorAll("svg.catalog-survey-rating__icon")
    );
    expect(ratingIcons).toHaveLength(5);
    expect(ratingIcons.map((icon) => icon.getAttribute("data-icon"))).toEqual([
      "face-frown-open",
      "face-frown",
      "face-meh",
      "face-smile",
      "face-laugh-beam",
    ]);
    ["😞", "🙁", "😐", "🙂", "😄", "☺"].forEach((emoji) => {
      expect(view.container.textContent).not.toContain(emoji);
    });
    await view.unmount();
  });

  test("provides complete German and English survey text", () => {
    const translations = {
      Feedback: "Feedback",
      "Give feedback": "Feedback geben",
      "Feedback completed": "Feedback abgeschlossen",
      "Close feedback survey": "Feedback-Befragung schließen",
      "User survey": "Nutzerbefragung",
      "Your feedback": "Dein Feedback",
      "How understandable is the system?": "Wie verständlich ist das System?",
      "How easy is it to find relevant datasets?":
        "Wie einfach lassen sich relevante Datensätze finden?",
      "Step 1 of 2": "Schritt 1 von 2",
      "Step 2 of 2": "Schritt 2 von 2",
      "Choose the answer that best matches your experience.":
        "Wähle die Antwort, die deiner Erfahrung am besten entspricht.",
      "Your first answer has already been saved separately.":
        "Deine erste Antwort wurde bereits separat gespeichert.",
      "Very poor": "Sehr schlecht",
      Poor: "Schlecht",
      Neutral: "Neutral",
      Good: "Gut",
      "Very good": "Sehr gut",
      "Please select a rating.": "Bitte wähle eine Bewertung aus.",
      "Feedback could not be saved. Please try again.":
        "Das Feedback konnte nicht gespeichert werden. Bitte versuche es erneut.",
      "Saving...": "Wird gespeichert...",
      "Try again": "Erneut versuchen",
      Close: "Schließen",
      Cancel: "Abbrechen",
      Next: "Weiter",
      Submit: "Absenden",
      "Thank you for your feedback!": "Vielen Dank für dein Feedback!",
      "Both answers were saved and evaluated separately.":
        "Beide Antworten wurden separat gespeichert und werden getrennt ausgewertet.",
    };

    Object.entries(translations).forEach(([english, german]) => {
      expect(translateText(english, "en")).toBe(english);
      expect(translateText(english, "de")).toBe(german);
      expect(translateText(german, "en")).toBe(english);
    });
  });

  test("stores each step independently and completes after the second answer", async () => {
    recordCatalogSurveyResponse.mockResolvedValue(true);
    const view = await renderSurvey();

    await click(view.container.querySelector(".catalog-survey-launcher"));
    expect(view.container.textContent).toContain("How understandable is the system?");
    await click(view.container.querySelector('input[value="4"]'));
    await click(buttonWithText(view.container, "Next"));

    expect(recordCatalogSurveyResponse).toHaveBeenCalledTimes(1);
    expect(recordCatalogSurveyResponse.mock.calls[0][0]).toMatchObject({
      questionId: CATALOG_SURVEY_QUESTION_IDS.systemComprehensibility,
      rating: 4,
    });
    expect(view.container.textContent).toContain("How easy is it to find relevant datasets?");

    await click(view.container.querySelector('input[value="5"]'));
    await click(buttonWithText(view.container, "Submit"));

    expect(recordCatalogSurveyResponse).toHaveBeenCalledTimes(2);
    expect(recordCatalogSurveyResponse.mock.calls[1][0]).toMatchObject({
      questionId: CATALOG_SURVEY_QUESTION_IDS.datasetFindability,
      rating: 5,
    });
    expect(recordCatalogSurveyResponse.mock.calls[1][0].eventId).not.toBe(
      recordCatalogSurveyResponse.mock.calls[0][0].eventId
    );
    expect(view.container.textContent).toContain("Thank you for your feedback!");
    await view.unmount();
  });

  test("stays on a failed step and retries with the same event id", async () => {
    recordCatalogSurveyResponse
      .mockRejectedValueOnce(new Error("network error"))
      .mockResolvedValueOnce(true);
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const view = await renderSurvey();

    await click(view.container.querySelector(".catalog-survey-launcher"));
    await click(view.container.querySelector('input[value="3"]'));
    await click(buttonWithText(view.container, "Next"));

    expect(view.container.textContent).toContain("How understandable is the system?");
    expect(view.container.textContent).toContain("Feedback could not be saved.");
    const firstEventId = recordCatalogSurveyResponse.mock.calls[0][0].eventId;
    expect(firstEventId).toBeTruthy();

    await click(buttonWithText(view.container, "Try again"));
    expect(recordCatalogSurveyResponse).toHaveBeenCalledTimes(2);
    expect(recordCatalogSurveyResponse.mock.calls[1][0].eventId).toBe(firstEventId);
    expect(view.container.textContent).toContain("How easy is it to find relevant datasets?");

    consoleSpy.mockRestore();
    await view.unmount();
  });
});
