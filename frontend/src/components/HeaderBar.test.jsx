import React, { act } from "react";
import { createRoot } from "react-dom/client";
import HeaderBar from "./HeaderBar";

jest.mock("@inrupt/solid-client", () => ({
  getSolidDataset: jest.fn(),
  getThing: jest.fn(),
  getStringNoLocale: jest.fn(),
  getUrl: jest.fn(),
}));

jest.mock("@inrupt/vocab-common-rdf", () => ({
  FOAF: { name: "foaf:name", img: "foaf:img" },
  VCARD: {
    fn: "vcard:fn",
    hasPhoto: "vcard:hasPhoto",
    value: "vcard:value",
    url: "vcard:url",
    hasEmail: "vcard:hasEmail",
  },
}));

jest.mock("../solidSession", () => ({
  session: {
    info: { isLoggedIn: false, webId: "" },
    login: jest.fn(),
    logout: jest.fn(),
    fetch: jest.fn(),
  },
}));

describe("HeaderBar", () => {
  beforeAll(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = "";
    window.localStorage.clear();
  });

  test("keeps the standalone language selector inside the header actions", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <HeaderBar
          languageControl={(
            <label className="language-select language-select--header">
              <select aria-label="Language" defaultValue="en">
                <option value="en">English</option>
                <option value="de">Deutsch</option>
              </select>
            </label>
          )}
        />
      );
      await Promise.resolve();
    });

    const headerActions = container.querySelector(".header-right");
    expect(headerActions).not.toBeNull();
    expect(
      headerActions.querySelector(".language-select--header")
    ).not.toBeNull();
    expect(container.querySelector(".language-select--standalone")).toBeNull();

    await act(async () => root.unmount());
    container.remove();
  });
});
