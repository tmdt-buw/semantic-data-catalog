import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const readCss = (path) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("application-owned scrollbars", () => {
  test.each([
    "public/styles.css",
    "src/embed/embed.css",
  ])("themes shared standalone and embed scroll owners in %s", (path) => {
    const css = readCss(path);

    expect(css).toMatch(
      /\.pod-picker-table-wrap,[\s\S]*\.dataset-grid\s*\{[^}]*scrollbar-width:\s*thin[^}]*scrollbar-color:\s*#7e93ae\s+#edf3f8/s
    );
    expect(css).toContain(
      ".modal:not(.dataset-add-modal):not(.dataset-detail-modal)::-webkit-scrollbar"
    );
    expect(css).not.toMatch(/(^|\n)\.modal::-webkit-scrollbar/m);
    expect(css).toMatch(/\.dataset-grid::-webkit-scrollbar-thumb:hover\s*\{[^}]*#142642/s);
    expect(css).toMatch(
      /\.dataset-grid\s*{[^}]*overscroll-behavior-y:\s*auto/s
    );
  });

  test("themes the survey drawer and detail body at their actual vertical scroll owners", () => {
    const surveyCss = readCss("src/components/CatalogSurvey.css");
    const detailCss = readCss("src/components/DatasetDetailModal.css");

    expect(surveyCss).toMatch(
      /\.catalog-survey-drawer\s*\{[^}]*overflow-y:\s*auto[^}]*scrollbar-width:\s*thin/s
    );
    expect(detailCss).toMatch(
      /\.dataset-detail-modal \.dataset-detail-body\s*\{[^}]*overflow-y:\s*auto[^}]*scrollbar-width:\s*thin/s
    );
    expect(surveyCss).toContain(".catalog-survey-drawer::-webkit-scrollbar-thumb:hover");
    expect(detailCss).toContain(
      ".dataset-detail-modal .dataset-detail-body::-webkit-scrollbar-thumb:hover"
    );
  });
});
