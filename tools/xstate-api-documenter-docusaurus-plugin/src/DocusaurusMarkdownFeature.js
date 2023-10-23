// Adapted from https://github.com/microsoft/rushstack-websites/tree/5335470/tools/api-documenter-docusaurus-plugin

// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

const fs = require('node:fs');
const path = require('node:path');
const { MarkdownDocumenterFeature } = require('@microsoft/api-documenter');

/**
 * @typedef {Object} INavigationNode
 * @property {string} type
 * @property {string} label
 * @property {string} [id]
 * @property {INavigationNode[]} [items]
 * @property {object} [link]
 */

/** @typedef {Object} INavigationFile */

class DocusaurusMarkdownFeature extends MarkdownDocumenterFeature {
  /**
   * @private
   * @default new Set<ApiItem>()
   */
  _apiItemsWithPages = new Set();

  /**
   * @public
   * @returns {void}
   */
  onInitialized() {}

  /**
   * @public
   * @param {IMarkdownDocumenterFeatureOnBeforeWritePageArgs} eventArgs
   * @returns {void}
   */
  onBeforeWritePage(eventArgs) {
    // Add the Docusaurus frontmatter
    const header = [
      `---`,
      // Generated API docs have a built-in title header below the Markdown breadcrumbs
      // `title: ${JSON.stringify(eventArgs.apiItem.displayName)}`,
      `hide_title: true`,

      // Suppress the default Edit button
      `custom_edit_url: null`,

      // suppress the Next/Prev links for API docs
      // because the link text is just the filename
      `pagination_prev: null`,
      `pagination_next: null`,
      `---`,
      ''
    ].join('\n');
    eventArgs.pageContent = header + eventArgs.pageContent;

    // API Documenter generates "<!-- -->" comments to prevent emitted Markdown from
    // being misinterpreted in certain contexts that are handed ambiguously by different
    // Markdown engines.  See these test cases for some examples:
    //
    // https://github.com/microsoft/rushstack/blob/484a7be546784783f5a7b4d387cbb48b0cebde27/apps/api-documenter/src/markdown/test/__snapshots__/CustomMarkdownEmitter.test.ts.snap#L25
    // https://github.com/microsoft/rushstack/blob/484a7be546784783f5a7b4d387cbb48b0cebde27/apps/api-documenter/src/markdown/MarkdownEmitter.ts#L248
    //
    // HTML comments don't work with Docusaurus, because it uses MDX instead of Markdown.
    // However empty React fragments have an equivalent effect:
    eventArgs.pageContent = eventArgs.pageContent.replace(/<!-- -->/g, '<></>');

    // try to remove API Documenter breadcrumbs to prefer Docusaurus breadcrumbs instead
    // removes any lines in the Markdown ouput that start with [Home]
    eventArgs.pageContent = eventArgs.pageContent.replace(/\[Home\]\(.\/index.md\) &gt;.+/, '');

    this._apiItemsWithPages.add(eventArgs.apiItem);
  }

  /**
   * @public
   * @param {IMarkdownDocumenterFeatureOnFinishedArgs} eventArgs
   * @returns {void}
   */
  onFinished(eventArgs) {
    // generate a categorized sidebar.json which can be loaded by Docusaurus
    let navigationFile = []
    this._buildNavigation(navigationFile, this.context.apiModel);

    const navFilePath = path.join(this.context.outputFolder, '..', '..', 'sidebar-xstate-api.json');
    const navFileContent = JSON.stringify(navigationFile, undefined, 2);

    console.log('Writing', navFilePath);
    fs.writeFileSync(navFilePath, navFileContent);

    fs.copyFileSync(
      path.join(this.context.outputFolder, 'xstate.md'),
      path.join(this.context.outputFolder, 'index.md')
    )
    fs.rmSync(
      path.join(this.context.outputFolder, 'xstate.md')
    )
  }

  /**
   * @private
   * @param {INavigationNode[]} parentNodes
   * @param {ApiItem} parentApiItem
   * @returns {void}
   */
  _buildNavigation(parentNodes, parentApiItem) {
    for (const apiItem of parentApiItem.members) {
      if (this._apiItemsWithPages.has(apiItem)) {
        let label = apiItem.displayName;

        let id = path.posix
          .join(this.context.documenter.getLinkForApiItem(apiItem))
          .replace(/\.md$/, '')
          .replace(/\/$/, '/index');
        const children = [];
        this._buildNavigation(children, apiItem);

        if (children.length > 0) {
          // special case to rename top-level
          if (id == 'xstate') {
            label = 'XState API'
            id = 'index'
          }

          const newNode = {
            type: 'category',
            label,
            link: { type: 'doc', id },
            items: children
          };
          parentNodes.push(newNode);
        } else {
          const newNode = {
            type: 'doc',
            label,
            id
          };
          parentNodes.push(newNode);
        }
      } else {
        this._buildNavigation(parentNodes, apiItem);
      }
    }
  }
}

module.exports = { DocusaurusMarkdownFeature }
