const fs = require("fs");
const path = require("path");

describe("standalone scaling", () => {
  const publicStyles = fs.readFileSync(
    path.resolve(__dirname, "../public/styles.css"),
    "utf8"
  );
  const embedStyles = fs.readFileSync(
    path.resolve(__dirname, "embed/embed.css"),
    "utf8"
  );
  const standaloneEntry = fs.readFileSync(
    path.resolve(__dirname, "index.js"),
    "utf8"
  );
  const appSource = fs.readFileSync(path.resolve(__dirname, "App.js"), "utf8");
  const embedEntry = fs.readFileSync(
    path.resolve(__dirname, "embed/SemanticDataCatalogEmbed.jsx"),
    "utf8"
  );

  test("uses zoom only outside Safari and leaves Safari unscaled", () => {
    expect(publicStyles).toMatch(
      /body\s*\{[^}]*zoom:\s*var\(--semantic-catalog-standalone-scale\)/s
    );
    expect(publicStyles).toMatch(
      /html\.browser-safari\s+body\s*\{[^}]*zoom:\s*1/s
    );
    expect(publicStyles).toMatch(
      /html\.browser-safari\s*\{[^}]*--dataspace-scaled-vh:\s*100vh/s
    );
    expect(publicStyles).toMatch(
      /html\.browser-safari\s*\{[^}]*--dataspace-scaled-vh:\s*100dvh/s
    );
    expect(publicStyles).not.toMatch(
      /body\s*>\s*#root\s*\{[^}]*transform\s*:/s
    );
    expect(publicStyles).not.toMatch(
      /transform:\s*scale\(var\(--semantic-catalog-standalone-scale\)\)/
    );
  });

  test("runs Safari detection only from the standalone entry", () => {
    expect(standaloneEntry).toMatch(
      /import\s*\{\s*markSafariBrowser\s*\}\s*from\s*["']\.\/safariDetection["']/
    );
    expect(standaloneEntry).toMatch(/markSafariBrowser\(\)/);
    expect(appSource).not.toMatch(/safariDetection|markSafariBrowser/);
    expect(embedEntry).not.toMatch(/safariDetection|markSafariBrowser/);
  });

  test("does not export standalone scaling through the embed stylesheet", () => {
    expect(embedStyles).not.toMatch(/(^|[;{]\s*)zoom\s*:/m);
    expect(embedStyles).not.toMatch(/body\s*>\s*#root[^}]*transform\s*:/s);
  });
});
