import { Page, PageScreenshotOptions } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export async function takeScreenshot({
  title,
  page,
  url,
  options,
  actions,
}: {
  title: string;
  page: Page;
  url?: string;
  options?: PageScreenshotOptions;
  actions?: (page: Page) => Promise<void>;
}) {
  await loginHelper({ page, redirectTo: url });

  const screenshotDir = 'static/screenshots';
  // Take a screenshot of the page in both dark and light mode
  for (const colorMode of ['dark', 'light']) {
    // We always start in dark mode, so it's only necessary to switch to light mode after the first screenshot
    if (colorMode === 'light') {
      // escape to close panels that may be open and prevent reload
      await page.keyboard.press('Escape');
      // reload page to close panels and modals that may be open
      await page.reload();
      await page
        .getByRole('button', { name: process.env.TEST_USER_NAME })
        .click();
      await page
        .getByRole('menuitem', { name: 'Switch to light mode' })
        .click();

      // Ensure the user menu is fully closed
      await page.waitForTimeout(500);
    }
    if (actions) await actions(page);
    await page.screenshot({
      path: `${screenshotDir}/${title}.${colorMode}.png`,
      ...options,
    });
  }

  await logoutHelper({ page });
}

export async function gotoHelper({
  page,
  path = 'editor',
}: {
  page: Page;
  path?: string;
}): Promise<void> {
  await page.goto(path, { timeout: 30000 });
  await page.waitForLoadState('networkidle');
}

export async function loginHelper({
  page,
  redirectTo,
}: {
  page: Page;
  redirectTo?: string;
}): Promise<void> {
  await gotoHelper({
    page,
    path: `registry/login?redirectTo=${redirectTo ?? 'projects'}`,
  });

  await page
    .getByPlaceholder('Your email address')
    .fill(process.env.TEST_USER_EMAIL);
  await page
    .getByPlaceholder('Your password')
    .fill(process.env.TEST_USER_PASSWORD);
  await page.getByText('Sign in', { exact: true }).click();
  await page.waitForLoadState('domcontentloaded');

  // The editor can be slow to start (especially in Safari) so we need to wait a bit before the editor is fully ready after a login
  // TODO: figure out if we can await something that is more specific than a timeout
  await page.waitForTimeout(3000);
}

export async function logoutHelper({ page }: { page: Page }): Promise<void> {
  // If we're logged in, make sure to log out
  await page.goto('registry/logout', { waitUntil: 'networkidle' });
  await page.close();
}
