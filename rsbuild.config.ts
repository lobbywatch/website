import {
  defineConfig,
  logger,
  type RequestHandler,
  type SetupMiddlewaresContext,
} from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { app, type BuildEnv, type SSRModule } from './server/app.ts'

export const serverRender = (
  serverContext: SetupMiddlewaresContext,
): RequestHandler => {
  const buildEnv: BuildEnv = {
    loadBundle: async (name: string) =>
      await serverContext.environments.node.loadBundle<SSRModule>(name),
    loadHtml: async (name: string) =>
      await serverContext.environments.web.getTransformedHtml(name),
  }

  return async (req, res, next) => {
    app({ ...buildEnv, next })(req, res)
  }
}

export default defineConfig({
  plugins: [pluginReact()],
  dev: {
    writeToDisk: true,
    setupMiddlewares: [
      ({ unshift }, serverContext) => {
        const serverRenderMiddleware = serverRender(serverContext)
        unshift(async (req, res, next) => {
          try {
            await serverRenderMiddleware(req, res, next)
          } catch (err) {
            logger.error('SSR render error, downgrade to CSR...')
            logger.error(err)
            next()
          }
        })
      },
    ],
  },
  html: {
    inject: false,
    template: './server/template.html',
  },
  environments: {
    web: {
      source: {
        entry: {
          index: './pages/[locale]/index.web.tsx',
          parlamentarier: './pages/[locale]/parlamentarier/index.web.tsx',
        },
      },
      output: {
        distPath: {
          css: 'static/web/css',
          js: 'static/web/js',
        },
        injectStyles: false,
        manifest: {
          filename: 'manifest.web.json',
        },
      },
    },
    node: {
      source: {
        entry: {
          index: './pages/[locale]/index.tsx',
          parlamentarier: './pages/[locale]/parlamentarier/index.tsx',
        },
      },
      output: {
        target: 'node',
        emitAssets: true,
        emitCss: true,
        distPath: {
          css: 'static/node/css',
          js: 'static/node/js',
        },
        manifest: {
          filename: 'manifest.node.json',
        },
      },
    },
  },
})
