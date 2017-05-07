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

## Countdown Teaser

You can configure a countdown date, before that date a teaser website will be shown.

```
COUNTDOWN_UTC=2017-05-11T18:00:00.000Z
```

`constants.js` will export a `COUNTDOWN_UTC` (`Date.toISOString()`) and `COUNTDOWN_DATE` from it, for usage in the application code.

Additionally you can configure a backdoor URL. Opening that URL sets a cookie which allows to circumvent the countdown page.

```
BACKDOOR_URL=/iftah-ya-simsim
```

Shout-out to [Schmidsi](https://github.com/schmidsi) for building the countdown page.
