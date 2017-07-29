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

#### Choose Color

Check which color is currently free:

```
$ cf target -s Production
$ cf routes
Getting routes for org Lobbywatch / space Production as you@example.com ...

space       host  domain         apps
Production        lobbywatch.ch  lobbywatch-green
```

The color with the domain `lobbywatch.ch` and an empty host is the productive one. In the above shown case we should deploy to `blue` since `green` is productive.

##### Deploying Blue

```bash
# Scale Up and Deploy Blue
cf scale lobbywatch-blue -i 2 -m 512M
cf push lobbywatch-blue -d lobbywatch.ch -n next
# Test the deploy on next.lobbywatch.ch
while true

# Re-Route to Blue
cf set-env lobbywatch-blue PUBLIC_BASE_URL https://lobbywatch.ch
cf restart lobbywatch-blue
cf map-route lobbywatch-blue lobbywatch.ch
cf map-route lobbywatch-blue lobbywatch.ch -n www
cf unmap-route lobbywatch-green lobbywatch.ch
cf unmap-route lobbywatch-green lobbywatch.ch -n www
cf unmap-route lobbywatch-blue lobbywatch.ch -n next
cf unset-env lobbywatch-green PUBLIC_BASE_URL

# Scale Down Green
cf scale lobbywatch-green -i 0 -m 128M
```


##### Deploying Green

```bash
# Scale Up and Deploy Green
cf scale lobbywatch-green -i 2 -m 512M
cf push lobbywatch-green -d lobbywatch.ch -n next
# Test the deploy on next.lobbywatch.ch
while true

# Re-Route to Green
cf set-env lobbywatch-green PUBLIC_BASE_URL https://lobbywatch.ch
cf restart lobbywatch-green
cf map-route lobbywatch-green lobbywatch.ch
cf map-route lobbywatch-green lobbywatch.ch -n www
cf unmap-route lobbywatch-blue lobbywatch.ch
cf unmap-route lobbywatch-blue lobbywatch.ch -n www
cf unmap-route lobbywatch-green lobbywatch.ch -n next
cf unset-env lobbywatch-blue PUBLIC_BASE_URL

# Scale Down Blue
cf scale lobbywatch-blue -i 0 -m 128M
```

### Api only

```
cf push lobbylayer-api -c "node api.js"
```
