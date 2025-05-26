# Lobbywatch Frontend

Lobbywatch.ch build with React.js and the [Next.js](https://github.com/zeit/next.js/) Framework.

## Prerequisites

To run the application you'll need Node.js v14 or higher.

## Develop

Run the following commands to start a local development server:

```bash
npm install
npm run dev
```

or with env settings

```bash
npm install
NEXT_PUBLIC_PUBLIC_BASE_URL='http://lobbywatch.local' NEXT_PUBLIC_DEBUG_INFORMATION=1 npm run dev
```

## Deploy

The `main` branch is automatically deployed to production on [deplo.io](https://deplo.io).

Deployments can be manipulated with [nctl](https://docs.nine.ch/docs/nctl/) or via [cockpit.nine.ch](https://cockpit.nine.ch/).

### Testing

```shell
nctl update app lobbywatch-website-testing --replicas=1 --git-revision=feat/whatever
```

when testing is finished make sure to stop the testing stage by running

```shell
nctl update app lobbywatch-website-testing --pause
```

## Translations

Google sheet containing the translations:

https://docs.google.com/spreadsheets/d/1FhjogYL2SBxaJG3RfR01A7lWtb3XTE2dH8EtYdmdWXg/edit

Importing Google sheet translations requires a Google API Key, see https://github.com/interactivethings/gsheets#google-sheets-api-key

Save your API in the `.env` file:

```bash
GSHEETS_API_KEY=
```

Finally, import the translations:

```bash
npm run translations
```

## License

The source code is «BSD 3-clause» licensed.
