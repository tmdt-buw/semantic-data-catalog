import React from "react";
import { useI18n } from "../i18n";
import "./CatalogLoadingState.css";

export default function CatalogLoadingState({
  title,
  description = "",
  embedded = false,
}) {
  const { language, t } = useI18n();
  const translatedTitle = t(title);
  const translatedDescription = t(description);

  return (
    <div
      lang={language}
      className={`catalog-loading-app catalog-loading-app--loading catalog-loading-app--${
        embedded ? "embedded" : "standalone"
      }`}
    >
      <main className="catalog-full-loader" aria-busy="true">
        <span className="catalog-full-loader__mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M5 5.75C5 4.78 8.13 4 12 4s7 .78 7 1.75-3.13 1.75-7 1.75-7-.78-7-1.75Z" />
            <path d="M5 5.75v4.5C5 11.22 8.13 12 12 12s7-.78 7-1.75v-4.5" />
            <path d="M5 10.25v4.5c0 .97 3.13 1.75 7 1.75s7-.78 7-1.75v-4.5" />
            <path d="M5 14.75v3.5C5 19.22 8.13 20 12 20s7-.78 7-1.75v-3.5" />
          </svg>
        </span>
        <h1>{translatedTitle}</h1>
        <p role="status" aria-live="polite">
          {translatedDescription}
        </p>
        <span
          className="catalog-full-loader__rail"
          role="progressbar"
          aria-label={translatedDescription}
        >
          <span />
        </span>
      </main>
    </div>
  );
}
