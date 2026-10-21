FROM node:22.23.4-alpine3.24@sha256:ce8d97f7cfc7c5386421eb932df20a29df99b1a7f469f6157d5c9956702ffadc AS build

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
