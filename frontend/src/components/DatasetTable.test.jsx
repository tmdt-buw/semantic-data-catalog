import React from "react";

jest.mock("@mui/material", () => ({ Box: ({ children }) => children }));
jest.mock("@mui/x-data-grid", () => ({ DataGrid: () => null }));

import { renderPublisherCell } from "./DatasetTable";

test("renders a table publisher as plain text even when a publisher WebID exists", () => {
  const rendered = renderPublisherCell({
    value: "Hannah Müller",
    row: {
      publisher_url:
        "https://solid-community-server.tmdt.info/sscon/profile/card#me",
    },
  });

  expect(rendered).toBe("Hannah Müller");
  expect(React.isValidElement(rendered)).toBe(false);
});
