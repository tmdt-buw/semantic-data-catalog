import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCommentDots,
  faFaceFrown,
  faFaceFrownOpen,
  faFaceLaughBeam,
  faFaceMeh,
  faFaceSmile,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useI18n } from "../i18n";
import {
  CATALOG_SURVEY_QUESTION_IDS,
  createCatalogSurveyEvent,
  deriveSurveyEventsUrl,
  normalizeStatisticsConfig,
  recordCatalogSurveyResponse,
} from "../statistics";
import {
  readCatalogSurveyQuestionState,
  writeCatalogSurveyQuestionState,
} from "../catalogSurveyState";
import "./CatalogSurvey.css";

const QUESTIONS = [
  {
    id: CATALOG_SURVEY_QUESTION_IDS.systemComprehensibility,
    title: "How understandable is the system?",
  },
  {
    id: CATALOG_SURVEY_QUESTION_IDS.datasetFindability,
    title: "How easy is it to find relevant datasets?",
  },
];

const RATINGS = [
  { value: 1, icon: faFaceFrownOpen, label: "Very poor" },
  { value: 2, icon: faFaceFrown, label: "Poor" },
  { value: 3, icon: faFaceMeh, label: "Neutral" },
  { value: 4, icon: faFaceSmile, label: "Good" },
  { value: 5, icon: faFaceLaughBeam, label: "Very good" },
];

const browserStorage = () => {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
};

const loadQuestionStates = (surveyEventsUrl) => {
  const storage = browserStorage();
  return Object.fromEntries(
    QUESTIONS.map(({ id }) => [
      id,
      readCatalogSurveyQuestionState({
        storage,
        surveyEventsUrl,
        questionId: id,
      }),
    ])
  );
};

const firstOpenQuestionIndex = (states) => {
  const index = QUESTIONS.findIndex(({ id }) => states[id]?.status !== "submitted");
  return index < 0 ? QUESTIONS.length : index;
};

export default function CatalogSurvey({
  session,
  statisticsConfig,
  catalogSurface,
  authenticated = false,
}) {
  const { t } = useI18n();
  const launcherRef = useRef(null);
  const drawerRef = useRef(null);
  const closeRef = useRef(null);
  const savingRef = useRef(false);
  const normalizedConfig = useMemo(
    () => normalizeStatisticsConfig(statisticsConfig),
    [statisticsConfig]
  );
  const surveyEventsUrl = useMemo(
    () => deriveSurveyEventsUrl(normalizedConfig.eventsUrl),
    [normalizedConfig.eventsUrl]
  );
  const available = Boolean(
    authenticated &&
    normalizedConfig.enabled &&
    surveyEventsUrl &&
    session?.info?.isLoggedIn &&
    typeof session?.fetch === "function"
  );

  const [open, setOpen] = useState(false);
  const [questionStates, setQuestionStates] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedRating, setSelectedRating] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  savingRef.current = saving;

  const refreshState = useCallback(() => {
    const nextStates = loadQuestionStates(surveyEventsUrl);
    const nextIndex = firstOpenQuestionIndex(nextStates);
    setQuestionStates(nextStates);
    setQuestionIndex(nextIndex);
    setSelectedRating(
      nextIndex < QUESTIONS.length
        ? nextStates[QUESTIONS[nextIndex].id]?.event?.rating ?? null
        : null
    );
    return nextStates;
  }, [surveyEventsUrl]);

  useEffect(() => {
    if (!available) {
      setOpen(false);
      return;
    }
    refreshState();
  }, [available, refreshState]);

  useEffect(() => {
    if (!open || typeof document === "undefined") return undefined;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0);
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !savingRef.current) {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        drawerRef.current?.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        ) || []
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused?.focus) previouslyFocused.focus();
      else launcherRef.current?.focus();
    };
  }, [open]);

  if (!available) return null;

  const completed = questionIndex >= QUESTIONS.length;
  const question = completed ? null : QUESTIONS[questionIndex];
  const pendingEvent = question ? questionStates[question.id]?.event : null;

  const handleOpen = () => {
    refreshState();
    setError("");
    setOpen(true);
  };

  const handleClose = () => {
    if (saving) return;
    setError("");
    setOpen(false);
  };

  const handleSave = async () => {
    if (!question || selectedRating === null) {
      setError(t("Please select a rating."));
      return;
    }

    setSaving(true);
    setError("");
    const event = pendingEvent || createCatalogSurveyEvent({
      questionId: question.id,
      rating: selectedRating,
      catalogSurface,
    });
    if (!event) {
      setSaving(false);
      setError(t("Feedback could not be saved. Please try again."));
      return;
    }

    const pendingState = { status: "pending", event };
    const statesWithPending = { ...questionStates, [question.id]: pendingState };
    setQuestionStates(statesWithPending);
    writeCatalogSurveyQuestionState({
      storage: browserStorage(),
      surveyEventsUrl,
      questionId: question.id,
      state: pendingState,
    });

    try {
      const saved = await recordCatalogSurveyResponse({
        session,
        statisticsConfig: normalizedConfig,
        ...event,
      });
      if (!saved) throw new Error("Survey response was not stored.");

      const submittedState = {
        status: "submitted",
        eventId: event.eventId,
        occurredAt: event.occurredAt,
      };
      writeCatalogSurveyQuestionState({
        storage: browserStorage(),
        surveyEventsUrl,
        questionId: question.id,
        state: submittedState,
      });
      const nextStates = { ...statesWithPending, [question.id]: submittedState };
      const nextIndex = firstOpenQuestionIndex(nextStates);
      setQuestionStates(nextStates);
      setQuestionIndex(nextIndex);
      setSelectedRating(
        nextIndex < QUESTIONS.length
          ? nextStates[QUESTIONS[nextIndex].id]?.event?.rating ?? null
          : null
      );
    } catch (saveError) {
      console.warn("Catalog survey response could not be stored.", saveError);
      setError(t("Feedback could not be saved. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        className="catalog-survey-launcher"
        onClick={handleOpen}
        aria-controls="catalog-survey-drawer"
        aria-expanded={open}
        aria-label={t("Give feedback")}
      >
        <FontAwesomeIcon
          icon={faCommentDots}
          aria-hidden="true"
          className="catalog-survey-launcher__icon"
        />
        <span className="catalog-survey-launcher__label">
          {t(completed ? "Feedback completed" : "Feedback")}
        </span>
      </button>

      {open && (
        <div className="catalog-survey-layer">
          <button
            type="button"
            className="catalog-survey-backdrop"
            onClick={handleClose}
            aria-label={t("Close feedback survey")}
            tabIndex={-1}
          />
          <aside
            id="catalog-survey-drawer"
            ref={drawerRef}
            className="catalog-survey-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="catalog-survey-title"
          >
            <header className="catalog-survey-header">
              <div>
                <span className="catalog-survey-eyebrow">{t("User survey")}</span>
                <h2 id="catalog-survey-title">{t("Your feedback")}</h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                className="catalog-survey-close"
                onClick={handleClose}
                disabled={saving}
                aria-label={t("Close")}
              >
                <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
              </button>
            </header>

            {completed ? (
              <div className="catalog-survey-complete" role="status">
                <div className="catalog-survey-complete__icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faCheck} />
                </div>
                <h3>{t("Thank you for your feedback!")}</h3>
                <p>{t("Both answers were saved and evaluated separately.")}</p>
                <button type="button" className="catalog-survey-primary" onClick={handleClose}>
                  {t("Close")}
                </button>
              </div>
            ) : (
              <div className="catalog-survey-content">
                <div className="catalog-survey-progress" aria-label={t(`Step ${questionIndex + 1} of 2`)}>
                  <span>{t(`Step ${questionIndex + 1} of 2`)}</span>
                  <div className="catalog-survey-progress__track" aria-hidden="true">
                    <span style={{ width: `${((questionIndex + 1) / 2) * 100}%` }} />
                  </div>
                </div>
                <h3>{t(question.title)}</h3>
                <p className="catalog-survey-hint">
                  {questionIndex === 0
                    ? t("Choose the answer that best matches your experience.")
                    : t("Your first answer has already been saved separately.")}
                </p>

                <fieldset className="catalog-survey-ratings" disabled={saving || Boolean(pendingEvent)}>
                  <legend className="catalog-survey-sr-only">{t(question.title)}</legend>
                  {RATINGS.map(({ value, icon, label }) => (
                    <label
                      key={value}
                      className={`catalog-survey-rating${selectedRating === value ? " is-selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`catalog-survey-${question.id}`}
                        value={value}
                        checked={selectedRating === value}
                        onChange={() => {
                          setSelectedRating(value);
                          setError("");
                        }}
                      />
                      <FontAwesomeIcon
                        icon={icon}
                        className="catalog-survey-rating__icon"
                        aria-hidden="true"
                      />
                      <span className="catalog-survey-rating__label">{t(label)}</span>
                    </label>
                  ))}
                </fieldset>

                {error && <p className="catalog-survey-error" role="alert">{error}</p>}

                <div className="catalog-survey-actions">
                  <button
                    type="button"
                    className="catalog-survey-secondary"
                    onClick={handleClose}
                    disabled={saving}
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    type="button"
                    className="catalog-survey-primary"
                    onClick={handleSave}
                    disabled={saving || selectedRating === null}
                  >
                    {saving
                      ? t("Saving...")
                      : t(pendingEvent ? "Try again" : questionIndex === 0 ? "Next" : "Submit")}
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
