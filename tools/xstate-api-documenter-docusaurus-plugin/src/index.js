// Based on https://github.com/microsoft/rushstack-websites/tree/5335470/tools/api-documenter-docusaurus-plugin

// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

const { DocusaurusMarkdownFeature } = require('./DocusaurusMarkdownFeature.js');

const apiDocumenterPluginManifest = {
  manifestVersion: 1000,
  features: [
    {
      featureName: 'docusaurus-markdown-documenter',
      kind: 'MarkdownDocumenterFeature',
      subclass: DocusaurusMarkdownFeature
    }
  ]
};

module.exports = { apiDocumenterPluginManifest }
