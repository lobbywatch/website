import { defineConfig } from '@rsbuild/core'

export default defineConfig({
  environments: {
    components: {
      output: {
        target: 'web',
        distPath: {
          root: 'public/components',
          js: '[name]',
          html: '[name]',
        },
        filename: {
          js: 'index.js',
          html: 'index.html',
        },
        filenameHash: false,
      },
      html: {
        template: './components/test.html',
      },
      source: {
        entry: {
          'lw-search': './components/lw-search/index.ts',
        },
      },
    },
  },
  server: {
    base: '/components',
    publicDir: {
      copyOnBuild: false,
    },
  },
})
