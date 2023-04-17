import { Page, test } from '@playwright/test';
import { takeScreenshot } from '@site/src/utils/playwrightUtils';

test('my_projects', ({ page }, { title }) => takeScreenshot({ title, page }));

test('version-history--versions', ({ page }, { title }) =>
  takeScreenshot({
    title,
    page,
    url: 'editor/29baf751-0b06-4c9f-a8ac-1fd470769a79?machineId=9999c2c1-c63f-4fa5-b333-b4a14dfacc3f', // version history feature machine
    actions: async(page: Page)=>{
      // target the button with the exact name “Version history” as there are multiple buttons containing the same text
      await page.getByRole('button', { name: 'Version history', exact: true }).click()
      // wait a few seconds to ensure the panel is loaded
      await page.waitForTimeout(3000)
      // move mouse out of way so tooltip doesn’t show
      await page.mouse.move(0, 100)
      // wait for tooltip to fade completely
      await page.waitForTimeout(1000)
    }
  }));

test('version-history--preview-version', ({ page }, { title }) =>
  takeScreenshot({
    title,
    page,
    url: 'editor/29baf751-0b06-4c9f-a8ac-1fd470769a79?machineId=9999c2c1-c63f-4fa5-b333-b4a14dfacc3f', // version history feature machine
    actions: async(page: Page)=>{
      // target the button with the exact name “Version history” as there are multiple buttons containing the same text
      await page.getByRole('button', { name: 'Version history', exact: true }).click()
      // wait a few seconds to ensure the panel is loaded
      await page.waitForTimeout(3000)
      // click the 2nd version button in the version history panel
      await page.getByTestId('version-select-btn').nth(2).click()
      // wait a few seconds to ensure the preview is loaded
      await page.waitForTimeout(3000)
    }
  }));

// This doesn’t work as we can’t target the restore button, but keeping because the clip options are right!
// test('version-history--restore-version', ({ page }, { title }) =>
//   takeScreenshot({
//     title,
//     page,
//     url: 'editor/29baf751-0b06-4c9f-a8ac-1fd470769a79?machineId=9999c2c1-c63f-4fa5-b333-b4a14dfacc3f', // version history feature machine
//     options: {
//       clip: {
//         width: 900,
//         height: 520,
//         x: 540,
//         y: 80
//       }
//     },
//     actions: async(page: Page)=>{
//       // target the button with the exact name “Version history” as there are multiple buttons containing the same text
//       await page.getByRole('button', { name: 'Version history', exact: true }).click()
//       // wait a few seconds to ensure the panel is loaded
//       await page.waitForTimeout(3000)
//       // click the 2nd version button in the version history panel
//       await page.getByTestId('version-select-btn').nth(2).hover();
//       // wait a few seconds to ensure the preview is loaded
//       await page.waitForTimeout(3000)
//     }
//   }));