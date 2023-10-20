// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as fs from 'node:fs'
import * as path from 'node:path';
import { ApiItem } from '@microsoft/api-extractor-model';
import {
  MarkdownDocumenterFeature,
  IMarkdownDocumenterFeatureOnBeforeWritePageArgs,
  IMarkdownDocumenterFeatureOnFinishedArgs
} from '@microsoft/api-documenter';

interface INavigationNode {
  type: string;
  label: string;
  id?: string;
  items?: INavigationNode[];
  link?: object
}

interface INavigationFile extends INavigationNode {}

export class DocusaurusMarkdownFeature extends MarkdownDocumenterFeature {
  private _apiItemsWithPages: Set<ApiItem> = new Set<ApiItem>();

  public onInitialized(): void {
    console.log('RushStackFeature: onInitialized()');
  }

  public onBeforeWritePage(eventArgs: IMarkdownDocumenterFeatureOnBeforeWritePageArgs): void {
    // Add the Docusaurus frontmatter
    const header: string = [
      `---`,
      // Generated API docs have a built-in title header below the breadcrumbs
      // `title: ${JSON.stringify(eventArgs.apiItem.displayName)}`,
      `hide_title: true`,
      // Suppress the default Edit button and Next/Prev links for API docs
      `custom_edit_url: null`,
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

    // try to remove breadcrumbs
    // by removing any lines that start with [Home]
    eventArgs.pageContent = eventArgs.pageContent.replace(/\[Home\]\(.\/index.md\) &gt;.+/, '')

    this._apiItemsWithPages.add(eventArgs.apiItem);
  }

  public onFinished(eventArgs: IMarkdownDocumenterFeatureOnFinishedArgs): void {
    console.log('finished!!!!')
    // const navigationFile: INavigationFile = {
    //   type: 'category',
    //   label: 'API Reference',
    //   items: [
    //     {
    //       type: 'doc',
    //       label: '(members)',
    //       id: 'index'
    //     }
    //   ]
    // };
    // this._buildNavigation(navigationFile.items!, this.context.apiModel);

    let navigationFile:[] = []
    this._buildNavigation(navigationFile, this.context.apiModel);

    const navFilePath: string = path.join(this.context.outputFolder, '..', '..', 'sidebar-xstate-api.json');
    const navFileContent: string = JSON.stringify(navigationFile, undefined, 2);

    console.log('writing:', navFilePath)
    fs.writeFileSync(navFilePath, navFileContent);
  }

  private _buildNavigation(parentNodes: INavigationNode[], parentApiItem: ApiItem): void {
    for (const apiItem of parentApiItem.members) {
      if (this._apiItemsWithPages.has(apiItem)) {
        const label = apiItem.displayName;

        const id = path.posix
          .join(this.context.documenter.getLinkForApiItem(apiItem)!)
          .replace(/\.md$/, '')
          .replace(/\/$/, '/index');
        const children: INavigationNode[] = [];
        this._buildNavigation(children, apiItem);

        if (children.length > 0) {
          const newNode: INavigationNode = {
            type: 'category',
            label,
            link: { type: 'doc', id },
            items: [
                  // {
                  //   type: 'doc',
                  //   label: '(members)',
                  //   id
                  // },
              ...children
            ]
          };
          parentNodes.push(newNode);
        } else {
          const newNode: INavigationNode = {
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
