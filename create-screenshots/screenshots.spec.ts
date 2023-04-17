import { test } from '@playwright/test';
import { takeScreenshot } from '@site/src/utils/playwrightUtils';

test('my_projects', ({ page }, { title }) => takeScreenshot({ title, page }));

test('editor', ({ page }, { title }) =>
  takeScreenshot({
    title,
    page,
    url: 'editor/2be6eae6-4d66-438e-ab87-872ade8ccc00?machineId=f09f3e2a-43ff-4bb7-a753-de7c80621789',
  }));
