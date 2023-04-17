# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

1.

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Creating screenshots

```
$ yarn create:screenshots
```

This will run the Playwright tests defined in `/create-screenshots`.
You need to add a few variables to your `.env` file for this to work.

```
TEST_BASE_URL="https://stately.ai"
TEST_USER_EMAIL="email of the user you use at the env defined in TEST_BASE_URL"
TEST_USER_PASSWORD=""
TEST_USER_NAME="name of the user (same as email unless you’ve changed it)"
```

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
