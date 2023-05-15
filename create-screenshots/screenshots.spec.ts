import { Page, test } from '@playwright/test';
import { takeScreenshot } from '@site/src/utils/playwrightUtils';

test('discover--search', ({ page }, { title }) =>
  takeScreenshot({
    title,
    page,
    url: 'discover', // discover page
    actions: async (page: Page) => {
      // for full screen screenshots, make the browser a good size to capture the whole viewport without losing details
      await page.setViewportSize({
        width: 1620, // has to be this wide because otherwise we get a horizontal scrollbar
        height: 900,
      });
      // search for auth
      await page.getByPlaceholder('Search machines...').fill('auth');
      // can’t filter right now, need more accessible filter options
      // wait for everything to load
      await page.waitForTimeout(3000);
    },
  }));

test('version-history--versions', ({ page }, { title }) =>
  takeScreenshot({
    title,
    page,
    url: 'editor/4649a4f4-3624-452f-b9c2-afb51fd3f655?machineId=93df6cea-c491-4118-ae30-5e15b4d2697d', // dog walk machine
    actions: async (page: Page) => {
      // for full screen screenshots, make the browser a good size to capture the whole viewport without losing details
      await page.setViewportSize({
        width: 1200,
        height: 675,
      });
      // target the button with the exact name “Version history” as there are multiple buttons containing the same text
      await page
        .getByRole('button', { name: 'Version history', exact: true })
        .click();
      // wait a few seconds to ensure the panel is loaded
      await page.waitForTimeout(3000);
      // move mouse out of way so tooltip doesn’t show
      await page.mouse.move(0, 100);
      // wait for tooltip to fade completely
      await page.waitForTimeout(1000);
    },
  }));

test('version-history--preview-version', ({ page }, { title }) =>
  takeScreenshot({
    title,
    page,
    url: 'editor/4649a4f4-3624-452f-b9c2-afb51fd3f655?machineId=93df6cea-c491-4118-ae30-5e15b4d2697d', // dog walk machine
    actions: async (page: Page) => {
      // for full screen screenshots, make the browser a good size to capture the whole viewport without losing details
      await page.setViewportSize({
        width: 1200,
        height: 675,
      });
      // target the button with the exact name “Version history” as there are multiple buttons containing the same text
      await page
        .getByRole('button', { name: 'Version history', exact: true })
        .click();
      // wait a few seconds to ensure the panel is loaded
      await page.waitForTimeout(3000);
      // click the 2nd version button in the version history panel
      await page.getByTestId('version-select-btn').nth(2).click();
      // wait a few seconds to ensure the preview is loaded
      await page.waitForTimeout(3000);
    },
  }));

// has annoying tooltip visible in screenshot
test('version-history--restore-version', ({ page }, { title }) =>
  takeScreenshot({
    title,
    page,
    url: 'editor/4649a4f4-3624-452f-b9c2-afb51fd3f655?machineId=93df6cea-c491-4118-ae30-5e15b4d2697d', // dog walk machine
    options: {
      clip: {
        width: 900,
        height: 520,
        x: 540,
        y: 80,
      },
    },
    actions: async (page: Page) => {
      // target the button with the exact name “Version history” as there are multiple buttons containing the same text
      await page
        .getByRole('button', { name: 'Version history', exact: true })
        .click();
      // wait a few seconds to ensure the panel is loaded
      await page.waitForTimeout(3000);
      // click the 2nd version button in the version history panel
      await page.getByTestId('version-select-btn').nth(1).focus();
      // wait a few seconds to ensure the preview is loaded
      await page.waitForTimeout(3000);
    },
  }));

test('version-history--rename-version', ({ page }, { title }) =>
  takeScreenshot({
    title,
    page,
    url: 'editor/4649a4f4-3624-452f-b9c2-afb51fd3f655?machineId=93df6cea-c491-4118-ae30-5e15b4d2697d', // dog walk machine
    options: {
      clip: {
        width: 900,
        height: 520,
        x: 540,
        y: 80,
      },
    },
    actions: async (page: Page) => {
      // target the button with the exact name “Version history” as there are multiple buttons containing the same text
      await page
        .getByRole('button', { name: 'Version history', exact: true })
        .click();
      // wait a few seconds to ensure the panel is loaded
      await page.waitForTimeout(3000);
      // click the version name input box and fill in “New name”
      await page.getByLabel('Version name').nth(1).fill('New name');
      // wait a few seconds to ensure the preview is loaded
      await page.waitForTimeout(3000);
    },
  }));

test('import-from-github--import-from-github-button', ({ page }, { title }) =>
  takeScreenshot({
    title,
    page,
    url: '/projects', // my projects
    options: {
      clip: {
        width: 1344, // crop the width so the details are easier to see
        height: 400, // doesn’t need to be that tall, the button is near the top
        x: 135,
        y: 0,
      },
    },
    actions: async (page: Page) => {
      // for full screen screenshots, make the browser a good size to capture the whole viewport without losing details
      await page.setViewportSize({
        width: 1620, // has to be this wide because otherwise we get a horizontal scrollbar
        height: 960, // viewport still needs to be tall, otherwise we get a vertical scrollbar
      });
      // target the button with the exact name “Import from GitHub”
      await page
        .getByRole('button', { name: 'Import from GitHub', exact: true })
        .hover();
      // wait a few seconds to ensure the hover is transitioned
      await page.waitForTimeout(1000);
    },
  }));

test('projects--my-projects', ({ page }, { title }) =>
  takeScreenshot({
    title,
    page,
    url: '/projects', // my projects
    options: {
      clip: {
        width: 1344, // crop the width so the details are easier to see
        height: 600, // doesn’t need to be that tall, the button is near the top
        x: 135,
        y: 0,
      },
    },
    actions: async (page: Page) => {
      // for full screen screenshots, make the browser a good size to capture the whole viewport without losing details
      await page.setViewportSize({
        width: 1620, // has to be this wide because otherwise we get a horizontal scrollbar
        height: 960, // viewport still needs to be tall, otherwise we get a vertical scrollbar
      });
      // wait a few seconds to ensure the hover is transitioned
      await page.waitForTimeout(1000);
    },
  }));
  
// TODO: doesn’t work right now as sidebar remains open (+ so closes) for light mode screenshot, needs accessible expand + collapse
// test('projects--machines-list', ({ page }, { title }) =>
//   takeScreenshot({
//     title,
//     page,
//     url: '/editor/e13bef2b-bb13-4465-96ac-0bc25340688e?machineId=741f69fd-7f01-4932-9407-6871e225bb6d', // tutorial machines
//     options: {
//       clip: {
//         width: 700,
//         height: 520,
//         x: 0,
//         y: 0,
//       },
//     },
//     actions: async (page: Page) => {
//       await page
//         .getByRole('button', { name: 'Toggle sidebar', exact: true })
//         .click();
//       // wait a few seconds to ensure the drawer is open
//       await page.waitForTimeout(1000);
//     },
//   }));

test('projects--team-projects', ({ page }, { title }) =>
  takeScreenshot({
    title,
    page,
    url: '/projects', // my projects
    options: {
      clip: {
        width: 1344, // crop the width so the details are easier to see
        height: 800, // doesn’t need to be that tall, the button is near the top
        x: 135,
        y: 0,
      },
    },
    actions: async (page: Page) => {
      // for full screen screenshots, make the browser a good size to capture the whole viewport without losing details
      await page.setViewportSize({
        width: 1620, // has to be this wide because otherwise we get a horizontal scrollbar
        height: 960, // viewport still needs to be tall, otherwise we get a vertical scrollbar
      });
      // target the link with the exact name “Stately”
      await page
        .getByRole('link', { name: 'Stately', exact: true })
        .click();
      // wait a few seconds to ensure the view is loaded
      await page.waitForTimeout(3000);
    },
  }));

test('projects--move-project', ({ page }, { title }) =>
  takeScreenshot({
    title,
    page,
    url: 'editor/4649a4f4-3624-452f-b9c2-afb51fd3f655?machineId=93df6cea-c491-4118-ae30-5e15b4d2697d', // dog walk machine
    options: {
      clip: {
        width: 650,
        height: 480,
        x: 400,
        y: 0,
      },
    },
    actions: async (page: Page) => {
      // target the button with the exact name “Share”
      await page
        .getByRole('button', { name: 'Share', exact: true })
        .click();
      // wait a few seconds to ensure the modal is loaded
      await page.waitForTimeout(3000);
    },
  }));