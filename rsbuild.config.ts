import {
  defineConfig,
  logger,
  type RequestHandler,
  type SetupMiddlewaresContext,
} from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { app, type AppEnv, type SSRModule } from './playground/app.ts'

export const serverRender = (
  serverContext: SetupMiddlewaresContext,
): RequestHandler => {
  const appEnv: AppEnv = {
    loadBundle: async (name: string) => {
      const stats =
        await serverContext.environments.node.getTransformedHtml(name)
      console.log(stats)
      return await serverContext.environments.node.loadBundle<SSRModule>(name)
    },
    loadHtml: async (name: string) =>
      await serverContext.environments.web.getTransformedHtml(name),
  }

  return async (req, res, next) => {
    app(appEnv, next)(req, res)
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
    template: './playground/template.html',
  },
  environments: {
    web: {
      source: {
        entry: {
          index: './playground/index.tsx',
          test: './playground/test.tsx',
        },
      },
    },
    node: {
      source: {
        entry: {
          index: './playground/index.server.tsx',
          test: './pages/[locale]/index.tsx',
        },
      },
      output: {
        module: true,
        target: 'node',
        distPath: {
          root: 'dist/server',
        },
      },
    },
  },
})
