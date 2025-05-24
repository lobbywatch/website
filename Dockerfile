FROM node:20-alpine3.21@sha256:be56e91681a8ec1bba91e3006039bd228dc797fd984794a3efedab325b36e679

ENV NODE_ENV=production

WORKDIR /workspace/lobbywatch-website

RUN npm install -g husky

COPY . .

RUN npm ci && npm run build

# prevent Failed to update prerender cache for /de/content/links Error: EACCES: permission denied, mkdir '/workspace/lobbywatch-website/.next/server/pages/de'
RUN chown node:node .next/server/pages

USER node

CMD ["node", "node_modules/.bin/next", "start"]
