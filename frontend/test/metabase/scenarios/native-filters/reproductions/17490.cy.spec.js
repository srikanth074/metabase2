import {
  restore,
  mockSessionProperty,
  openNativeEditor,
} from "__support__/e2e/cypress";

import * as SQLFilter from "../helpers/e2e-sql-filter-helpers";

describe("issue 17490", () => {
  beforeEach(() => {
    mockSessionProperty("field-filter-operators-enabled?", true);

    restore();
    cy.signInAsAdmin();

    populateStubbedTables();
  });

  it("nav bar shouldn't cut off the popover with the tables for field filter selection (metabase#17490)", () => {
    cy.visit("/");
    cy.icon("sql").click();

    openNativeEditor();
    SQLFilter.enterParameterizedQuery("{{f}}");

    SQLFilter.openTypePickerFromDefaultFilterType();
    SQLFilter.chooseType("Field Filter");

    cy.wait("@tables");

    /**
     * Although `.click()` isn't neccessary for Cypress to fill out this input field,
     * it's something that we can use to assert that the input field is covered by another element.
     * Cypress fails to click any element that is not "actionable" (for example - when it's covered).
     * In other words, the `.click()` part is essential for this repro to work. Don't remove it.
     */
    cy.findByPlaceholderText("Find...")
      .click()
      .type("Orders")
      .blur();

    cy.findByDisplayValue("Orders");
  });
});

function populateStubbedTables() {
  cy.intercept("GET", "/api/database/1/schema/PUBLIC", req => {
    req.reply(res => {
      const fauxTable = {
        name: "Z",
        display_name: "ZZZ",
        id: 42, // id is hard coded, but it doesn't matter for this repro
      };

      const fauxTables = new Array(7).fill(fauxTable);
      const stubbedResponseBody = res.body.concat(fauxTables);

      res.body = stubbedResponseBody;
    });
  }).as("tables");
}
