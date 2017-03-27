# Lobbywatch Rooster

> 2017 is the year of the Rooster, starting from January 28th, and ending on February 15th, 2018.

Lobbywatch.ch build with React.js and the [Next.js](https://github.com/zeit/next.js/) Framework.

## Prerequisites

To run the application you'll need Node.js v6.9 or higher.

## Develop

Run the following commands to start a local development server:

```bash
npm install
npm run dev
```

## Deploy

To deploy the app to Swisscom Application Cloud run following [`cf-cli`](https://docs.developer.swisscom.com/cf-cli/install-go-cli.html) commands:

```bash
cf login -a https://api.lyra-836.appcloud.swisscom.com --sso
cf push lobbywatch-rooster
```

### Api only

```
cf push lobbylayer-api -c "node api.js"
```
