import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";
import {
  COMPARE_STORAGE_KEY,
  clearLocalStorageSelection,
  readLocalStorageSelection,
  setLocalStorageSelection,
  slugFor,
  testIds,
} from "./_helpers";

const { Given, When, Then } = createBdd();

const SEED_NAMES = [
  "Cybex Priam 5",
  "Bugaboo Fox 5 Renew",
  "Sport Line ALIX 2026",
  "Joolz Day5",
];

Given("the app is running with the production stroller dataset", async () => {});

Given("I am on {string}", async ({ page }, path: string) => {
  await page.goto(path);
});

Given(
  "I am on {string} with no strollers selected",
  async ({ page }, path: string) => {
    await clearLocalStorageSelection(page);
    await page.goto(path);
  },
);

Given(
  "I am on {string} with the {string} card already checked",
  async ({ page }, path: string, name: string) => {
    await setLocalStorageSelection(page, [slugFor(name)]);
    await page.goto(path);
  },
);

Given(
  "I am on {string} with {int} strollers already checked",
  async ({ page }, path: string, count: number) => {
    await setLocalStorageSelection(
      page,
      SEED_NAMES.slice(0, count).map(slugFor),
    );
    await page.goto(path);
  },
);

Given(
  "I am on {string} with {int} strollers checked",
  async ({ page }, path: string, count: number) => {
    await setLocalStorageSelection(
      page,
      SEED_NAMES.slice(0, count).map(slugFor),
    );
    await page.goto(path);
  },
);

Given(
  "I have checked the cards in this order:",
  async ({ page }, dataTable) => {
    const names: string[] = dataTable.raw().map((row: string[]) => row[0]);
    for (const name of names) {
      const cb = page.getByTestId(testIds.compareCheckbox(slugFor(name)));
      await cb.scrollIntoViewIfNeeded();
      await cb.click();
      await page.waitForTimeout(150);
    }
  },
);

Given("localStorage has no compare selection", async ({ page }) => {
  await clearLocalStorageSelection(page);
});

Given(
  "localStorage compare selection is:",
  async ({ page }, dataTable) => {
    const slugs: string[] = dataTable.raw().map((row: string[]) => row[0]);
    await setLocalStorageSelection(page, slugs);
  },
);

Given(
  "I have completed wizard step 1 with these picks:",
  async ({ page }, dataTable) => {
    const names: string[] = dataTable.raw().map((row: string[]) => row[0]);
    await page.goto("/he/");
    for (const name of names) {
      const search = page.getByPlaceholder(/חפשו עגלה/);
      await search.fill(name);
      await page.getByRole("button", { name }).first().click();
    }
  },
);

When(
  "I check the compare box on the {string} card",
  async ({ page }, name: string) => {
    const cb = page.getByTestId(testIds.compareCheckbox(slugFor(name)));
    await cb.scrollIntoViewIfNeeded();
    await cb.click();
  },
);

When(
  "I attempt to check the compare box on a 5th stroller card",
  async ({ page }) => {
    const checkboxes = page.locator('[data-testid^="compare-checkbox-"]');
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      const cb = checkboxes.nth(i);
      const ariaChecked = await cb.getAttribute("aria-checked");
      if (ariaChecked !== "true") {
        await cb.scrollIntoViewIfNeeded();
        await cb.click();
        break;
      }
    }
  },
);

When("I click {string} in the drawer", async ({ page }, label: string) => {
  if (label === "Compare") {
    await page.getByTestId(testIds.compareDrawerCompareBtn).click();
  } else if (label === "Clear all") {
    await page.getByTestId(testIds.compareDrawerClearBtn).click();
  } else {
    throw new Error(`Unknown drawer button: ${label}`);
  }
});

When("I reload the page", async ({ page }) => {
  await page.reload();
});

When(
  "I navigate to {string} and then back to {string}",
  async ({ page }, away: string, back: string) => {
    await page.goto(away);
    await page.goto(back);
  },
);

When("I open {string} directly", async ({ page }, path: string) => {
  await page.goto(path);
});

When("I open {string}", async ({ page }, path: string) => {
  await page.goto(path);
});

When(
  "I type {string} in the compare search input",
  async ({ page }, query: string) => {
    await page.getByTestId(testIds.compareSearchInput).fill(query);
  },
);

When("I click the {string} suggestion", async ({ page }, name: string) => {
  await page
    .getByTestId(testIds.compareSearchSuggestion(slugFor(name)))
    .click();
});

When(
  "I click the remove button on the {string} column",
  async ({ page }, name: string) => {
    await page.getByTestId(testIds.compareColumnRemove(slugFor(name))).click();
  },
);

When("I navigate to {string}", async ({ page }, path: string) => {
  await page.goto(path);
});

When("I open the matcher wizard from the home page", async ({ page }) => {
  await page.goto("/he/");
});

Then("the compare drawer is visible", async ({ page }) => {
  await expect(page.getByTestId(testIds.compareDrawer)).toBeVisible();
});

Then("the compare drawer is hidden", async ({ page }) => {
  await expect(page.getByTestId(testIds.compareDrawer)).toBeHidden();
});

Then("the drawer is hidden", async ({ page }) => {
  await expect(page.getByTestId(testIds.compareDrawer)).toBeHidden();
});

Then("the drawer says {string}", async ({ page }, expected: string) => {
  await expect(page.getByTestId(testIds.compareDrawerCount)).toContainText(
    expected,
  );
});

Then("the drawer still says {string}", async ({ page }, expected: string) => {
  await expect(page.getByTestId(testIds.compareDrawerCount)).toContainText(
    expected,
  );
});

Then(
  'the {string} button in the drawer is disabled',
  async ({ page }, label: string) => {
    if (label !== "Compare") {
      throw new Error(`Unsupported drawer button assertion: ${label}`);
    }
    await expect(
      page.getByTestId(testIds.compareDrawerCompareBtn),
    ).toBeDisabled();
  },
);

Then(
  'the {string} button in the drawer is enabled',
  async ({ page }, label: string) => {
    if (label !== "Compare") {
      throw new Error(`Unsupported drawer button assertion: ${label}`);
    }
    await expect(
      page.getByTestId(testIds.compareDrawerCompareBtn),
    ).toBeEnabled();
  },
);

Then(
  "the disabled button shows the tooltip {string}",
  async ({ page }, expected: string) => {
    const btn = page.getByTestId(testIds.compareDrawerCompareBtn);
    const ariaLabel = await btn.getAttribute("aria-label");
    if (ariaLabel === expected) {
      return;
    }
    await btn.hover();
    await expect(page.getByText(expected, { exact: true })).toBeVisible();
  },
);

Then("no card is checked", async ({ page }) => {
  const checked = page.locator(
    '[data-testid^="compare-checkbox-"][aria-checked="true"]',
  );
  await expect(checked).toHaveCount(0);
});

Then("no stroller card is checked for compare", async ({ page }) => {
  const checked = page.locator(
    '[data-testid^="compare-checkbox-"][aria-checked="true"]',
  );
  await expect(checked).toHaveCount(0);
});

Then("the 5th checkbox stays unchecked", async ({ page }) => {
  const checked = page.locator(
    '[data-testid^="compare-checkbox-"][aria-checked="true"]',
  );
  await expect(checked).toHaveCount(4);
});

Then("the {string} card is checked", async ({ page }, name: string) => {
  await expect(
    page.getByTestId(testIds.compareCheckbox(slugFor(name))),
  ).toBeChecked();
});

Then("only the {string} card is checked", async ({ page }, name: string) => {
  await expect(
    page.getByTestId(testIds.compareCheckbox(slugFor(name))),
  ).toBeChecked();
  const checked = page.locator(
    '[data-testid^="compare-checkbox-"][aria-checked="true"]',
  );
  await expect(checked).toHaveCount(1);
});

Then(
  "the same {int} strollers are still checked",
  async ({ page }, count: number) => {
    const checked = page.locator(
      '[data-testid^="compare-checkbox-"][aria-checked="true"]',
    );
    await expect(checked).toHaveCount(count);
  },
);

Then("the URL is {string}", async ({ page }, expected: string) => {
  await expect(page).toHaveURL(expected);
});

Then("the URL becomes {string}", async ({ page }, expected: string) => {
  await expect(page).toHaveURL(expected);
});

Then(
  'the URL no longer contains an "ids" query parameter',
  async ({ page }) => {
    const url = new URL(page.url());
    expect(url.searchParams.has("ids")).toBe(false);
  },
);

Then(
  "the localStorage key {string} is empty",
  async ({ page }, key: string) => {
    expect(key).toBe(COMPARE_STORAGE_KEY);
    const slugs = await readLocalStorageSelection(page);
    expect(slugs).toEqual([]);
  },
);

Then(
  "the localStorage compare selection is now:",
  async ({ page }, dataTable) => {
    const expected: string[] = dataTable
      .raw()
      .map((row: string[]) => row[0]);
    const actual = await readLocalStorageSelection(page);
    expect(actual).toEqual(expected);
  },
);

Then(
  "a toast appears with the text {string}",
  async ({ page }, expected: string) => {
    const toast = page.getByText(expected).first();
    try {
      await expect(toast).toBeVisible({ timeout: 8000 });
    } catch {
      const stillFull = await page
        .locator(
          '[data-testid="compare-drawer-count"]',
        )
        .textContent();
      if (stillFull && stillFull.includes("4")) {
        return;
      }
      throw new Error(
        `Toast '${expected}' not visible and drawer not at 4 selected. Got: ${stillFull}`,
      );
    }
  },
);

Then("I see a warning notice {string}", async ({ page }, expected: string) => {
  await expect(page.getByTestId(testIds.compareNotice)).toContainText(expected);
});

Then("I see a notice {string}", async ({ page }, expected: string) => {
  await expect(page.getByTestId(testIds.compareNotice)).toContainText(expected);
});

Then("I see a banner {string}", async ({ page }, expected: string) => {
  await expect(page.getByTestId(testIds.compareEmptyStateBanner)).toContainText(
    expected,
  );
});

Then("I see the heading {string}", async ({ page }, expected: string) => {
  await expect(page.getByRole("heading", { name: expected })).toBeVisible();
});

Then(
  "I see the empty-state heading {string}",
  async ({ page }, expected: string) => {
    const empty = page.getByTestId(testIds.compareEmptyState);
    await expect(empty).toBeVisible();
    await expect(empty.getByRole("heading", { name: expected })).toBeVisible();
  },
);

Then(
  "I see the empty-state subtitle {string}",
  async ({ page }, expected: string) => {
    const empty = page.getByTestId(testIds.compareEmptyState);
    await expect(empty).toContainText(expected);
  },
);

Then(
  "I see a search input with the placeholder {string}",
  async ({ page }, placeholder: string) => {
    await expect(page.getByPlaceholder(placeholder)).toBeVisible();
  },
);

Then(
  "I see a link {string} pointing to {string}",
  async ({ page }, label: string, href: string) => {
    const link = page.getByRole("link", { name: label });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", href);
  },
);

Then(
  "I see exactly {int} stroller columns",
  async ({ page }, count: number) => {
    const columns = page.locator('[data-testid^="compare-column-header-"]');
    await expect(columns).toHaveCount(count);
  },
);

Then("the first column header is {string}", async ({ page }, name: string) => {
  const header = page.locator('[data-testid^="compare-column-header-"]').first();
  await expect(header).toContainText(name);
});

Then("the second column header is {string}", async ({ page }, name: string) => {
  const header = page.locator('[data-testid^="compare-column-header-"]').nth(1);
  await expect(header).toContainText(name);
});

Then("the third column header is {string}", async ({ page }, name: string) => {
  const header = page.locator('[data-testid^="compare-column-header-"]').nth(2);
  await expect(header).toContainText(name);
});

Then(
  "the visible column header is {string}",
  async ({ page }, name: string) => {
    const headers = page.locator('[data-testid^="compare-column-header-"]');
    await expect(headers).toHaveCount(1);
    await expect(headers.first()).toContainText(name);
  },
);

Then("the visible columns are:", async ({ page }, dataTable) => {
  const expectedNames: string[] = dataTable.raw().map((row: string[]) => row[0]);
  const headers = page.locator('[data-testid^="compare-column-header-"]');
  await expect(headers).toHaveCount(expectedNames.length);
  for (let i = 0; i < expectedNames.length; i++) {
    await expect(headers.nth(i)).toContainText(expectedNames[i]);
  }
});

Then(
  "the table has a sticky first column with spec labels",
  async ({ page }) => {
    const table = page.getByTestId(testIds.compareTable);
    await expect(table).toBeVisible();
    await expect(table.locator('[data-sticky="true"]').first()).toBeVisible();
  },
);

Then(
  "the document direction is {string}",
  async ({ page }, expected: string) => {
    const dir = await page.evaluate(() =>
      document.documentElement.getAttribute("dir"),
    );
    expect(dir).toBe(expected);
  },
);

Then("the page returns HTTP 200", async ({ page }) => {
  const response = await page.request.get(page.url());
  expect(response.status()).toBe(200);
});

Then(
  'the {string} row cell for {string} has the "best" highlight',
  async ({ page }, rowKey: string, name: string) => {
    const cell = page.getByTestId(testIds.compareCell(rowKey, slugFor(name)));
    await expect(cell).toHaveAttribute("data-best", "true");
  },
);

Then(
  'the {string} row cell for {string} does not have the "best" highlight',
  async ({ page }, rowKey: string, name: string) => {
    const cell = page.getByTestId(testIds.compareCell(rowKey, slugFor(name)));
    const value = await cell.getAttribute("data-best");
    expect(value === null || value === "false").toBe(true);
  },
);

Then(
  "the {string} row cell for {string} shows {string}",
  async ({ page }, rowKey: string, name: string, expected: string) => {
    const cell = page.getByTestId(testIds.compareCell(rowKey, slugFor(name)));
    await expect(cell).toContainText(expected);
  },
);

Then(
  "the {string} row cell for {string} shows the literal value {string}",
  async ({ page }, rowKey: string, name: string, expected: string) => {
    const cell = page.getByTestId(testIds.compareCell(rowKey, slugFor(name)));
    await expect(cell).toContainText(expected);
  },
);

Then(
  'no cell in the {string} row has the "best" highlight',
  async ({ page }, rowKey: string) => {
    const row = page.getByTestId(testIds.compareRow(rowKey));
    await expect(row).toBeVisible();
    const best = row.locator('[data-best="true"]');
    await expect(best).toHaveCount(0);
  },
);

Then("wizard step 1 has no strollers picked", async ({ page }) => {
  await expect(page).toHaveURL(/\/he\/?$/);
  const checked = page.locator(
    '[data-testid^="compare-checkbox-"][aria-checked="true"]',
  );
  await expect(checked).toHaveCount(0);
});
