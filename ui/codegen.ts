import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'http://localhost:8080/graphql',
  documents: ['./**/*.{vue,ts}'],
  importExtension: '.ts',
  generates: {
    'src/graphql/generated/': {
      preset: 'client',
      config: {
        nonOptionalTypename: true,
        useTypeImports: true,
        scalars: {
          CurrencyCode: 'string',
          DateTime: 'string',
          Long: 'number',
        },
        enumsAsConst: true,
        customDirectives: {
          apolloUnmask: true,
        },
        inlineFragmentTypes: 'mask',
      },
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
}
export default config
