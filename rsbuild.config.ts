import {
  defineConfig,
  logger,
  type RequestHandler,
  type SetupMiddlewaresContext,
} from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { app, type AppEnv, type SSRModule } from './playground/app.ts'
import { CssExtractRspackPlugin } from '@rspack/core'

export const serverRender = (
  serverContext: SetupMiddlewaresContext,
): RequestHandler => {
  const appEnv: AppEnv = {
    loadBundle: async (name: string) =>
      await serverContext.environments.node.loadBundle<SSRModule>(name),
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
  output: {
    cssModules: {
      auto: false,
    },
    manifest: true,
  },
  environments: {
    web: {
      source: {
        entry: {
          index: './playground/index.tsx',
        },
      },
    },
    node: {
      source: {
        entry: {
          index: './pages/[locale]/index.tsx',
        },
      },
      output: {
        target: 'node',
        module: true,
        distPath: {
          root: 'dist/server',
        },
      },
    },
  },
  tools: {
    bundlerChain: (chain, { CHAIN_ID }) => {
      chain.module.rules.delete(CHAIN_ID.RULE.CSS)
      chain.module.rules.delete(CHAIN_ID.RULE.CSS_INLINE)
      chain.module.rules.delete(CHAIN_ID.RULE.CSS_RAW)
    },
    cssExtract: {
      pluginOptions: {
        ignoreOrder: false,
        runtime: true,
      },
    },
    rspack: {
      plugins: [new CssExtractRspackPlugin({})],
      module: {
        rules: [
          {
            test: /\.css$/i,
            use: [CssExtractRspackPlugin.loader, 'css-loader'],
            type: 'javascript/auto',
          },
        ],
      },
    },
  },
})
