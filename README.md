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

### Staging

```bash
cf login -a https://api.lyra-836.appcloud.swisscom.com --sso
cf target -s Staging
cf push lobbywatch-rooster
```

### Production

We follow the [blue-green schema](https://docs.cloudfoundry.org/devguide/deploy-apps/blue-green.html). This results in following three steps.

#### 1. Choose Color

Check which color is currently free:

```
$ cf target -s Production
$ cf routes
Getting routes for org Lobbywatch / space Production as you@example.com ...

space       host  domain         apps
Production        lobbywatch.ch  lobbywatch-green
```

The color with the domain `lobbywatch.ch` and an empty host is the productive one. In the above shown case we should deploy to `blue` since `green` is productive.

#### 2. Deploy and Scale Up

```bash
cf push lobbywatch-blue -d lobbywatch.ch -n next
cf scale lobbywatch-blue -i 2 -m 512M
```

Test the deploy on `next.lobbywatch.ch`.

#### 3. Re-Route and Scale Down

If everything is fine, re-route traffic:

```bash
cf map-route lobbywatch-blue lobbywatch.ch
cf map-route lobbywatch-blue lobbywatch.ch -n www
cf unmap-route lobbywatch-green lobbywatch.ch
cf unmap-route lobbywatch-green lobbywatch.ch -n www
cf unmap-route lobbywatch-blue lobbywatch.ch -n next
```

Scale down the unused app:

```bash
cf scale lobbywatch-green -i 1 -m 128M
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
