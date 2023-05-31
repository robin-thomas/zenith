import { build } from 'esbuild';
import { config as dotenvConfig } from 'dotenv';
import cssModulesPlugin from 'esbuild-css-modules-plugin';

dotenvConfig();

build({
  entryPoints: ['source.tsx'],
  bundle: true,
  // minify: true,
  legalComments: 'none',
  format: 'esm',
  target: 'es2020',
  outfile: `public/cmp/ad-${process.env.npm_package_version}.js`,
  define: {
    'process.env.NEXT_PUBLIC_CONTRACT_ADDRESS': JSON.stringify(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS),
    'process.env.__NEXT_I18N_SUPPORT': JSON.stringify(false),
    'process.env.__NEXT_TRAILING_SLASH': JSON.stringify(false),
    'process.env.__NEXT_ROUTER_BASEPATH': JSON.stringify(''),
    'process.env.__NEXT_NEW_LINK_BEHAVIOR': JSON.stringify(false),
  },
  tsconfig: 'tsconfig.esbuild.json',
  plugins: [cssModulesPlugin()],
})
  .catch(() => process.exit(1));
