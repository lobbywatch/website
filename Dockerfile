FROM node:22.21.0-alpine3.21@sha256:03a43779873834861f97dc1d2cc7be8aeb7f910a6fc60bd1c42d69d4dfd008fb AS build

ENV NODE_ENV=production

ARG MATOMO_URL_BASE
ENV MATOMO_URL_BASE=${MATOMO_URL_BASE}

ARG MATOMO_SITE_ID
ENV MATOMO_SITE_ID=${MATOMO_SITE_ID}

ARG PUBLIC_BASE_URL
ENV PUBLIC_BASE_URL=${PUBLIC_BASE_URL}

WORKDIR /workspace/lobbywatch-website

RUN npm install -g husky

COPY . .

RUN npm ci && npm run build

# prevent "EACCES: permission denied" at runtime
RUN chown -R node:node .next/server/pages
RUN mkdir -p .next/cache/images
RUN chown -R node:node .next/cache

USER node

CMD ["node", "node_modules/.bin/next", "start"]
