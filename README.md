# Welcome to the Stately docs

This repo contains the Stately landing page, including our blog and docs for Stately Studio and XState.

The site is built using [Docusaurus 2](https://docusaurus.io/).

We welcome any contributions to the documentation and code base.

- ✨ [Contribution guide](https://github.com/statelyai/xstate/blob/main/CONTRIBUTING.md)
- 🖊️ [The Stately Guide to Writing Docs](https://github.com/statelyai/docs/wiki)
- 🙋 [Code of conduct](https://github.com/statelyai/docs/blob/main/CODE_OF_CONDUCT.md)

## Installation

```
$ yarn
```

## Local development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Note on the index page

Currently we serve the root landing page from a static file.

- During server side rendering (SSR) we use [`/static/index.html`](./static/index.html)
- During client side rendering (CSR) we use [`/static/landing-page/index.html`](./static/landing-page/index.html)

## Updating API Documentation

```
$ scripts/update-api-docs.sh
```

This command generates API Documentation as Markdown files to the `api` directory.

It uses [API Extractor](https://api-extractor.com) to analyze code and inline TSDoc comments from xstate packages, creating `*.api.json` doc model files, which are then used by [API Documenter](https://api-extractor.com/pages/setup/generating_docs) to generate Markdown files in the appropriate `api` directory for each package. We use the  [Docusaurus Multi-Instance](https://docusaurus.io/docs/docs-multi-instance) feature to configure each `api/*` directory as its own set of versionable docs.

## Build

```
$ yarn build
```

This command generates static content into the `build` directory.

## Deployment

The docs are built and deployed when merged into `main`.
