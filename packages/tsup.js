// import { build } from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'
import { readdir, readFile } from 'fs/promises'
import { dirname, resolve } from 'path'
import execa from 'execa'
// import tsPaths from 'esbuild-ts-paths'
import glob from 'glob'
import { sassPlugin } from 'esbuild-sass-plugin'
import svgrPlugin from 'esbuild-plugin-svgr'

import { defineConfig, build } from 'tsup'

console.log('xxx')
const pkg = JSON.parse(await readFile(resolve('./', 'package.json'), 'utf-8'))
console.log('xxx', process.cwd())
// const urlpack=fileURLToPath(pkg.)
//console.log('urlpack', urlpack)
/*
after copiling need call
tsc --emitDeclarationOnly

alternative command :
"build": "esbuild `find server \\( -name '*.ts' \\)` --platform=node --outdir=build/server",
*/

const buildDefault = {
  outdir: './dist/',
  minify: false,
  bundle: false,
  outbase: './src',
  format: ['esm'], // ['js', 'jsx', 'ts', 'tsx'].includes('js') ? undefined : 'esm',
  target: 'node16',
  sourcemap: true,
  outExtension: { '.js': '.mjs' },
  // external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
  plugins: [nodeExternalsPlugin(), sassPlugin()],
}

// build by tsconfig
// build({ plugins: [tsPaths('../../tsconfig-base.json')] }).catch(() => process.exit(1))

function createDeclaration() {
  execa('tsc', ['--emitDeclarationOnly'], {
    cwd: resolve(process.cwd(), ''),
    stdout: process.stdout,
  })
    .then(ex => console.log('', ex.command))
    .catch(error => console.log('error execa', error))
}

// const inject = glob.sync('src/**/*.mts', 'src/**/*.tsx')
//const inject = glob.sync('src/**/*.+(mts|tsx|ts)')  'src/**/!(*.mts_|*.tsx_|*.ts|*.ts )'
const inject = glob('src/**/*.*', {
  ignore: ['mts_', 'tsx_', 'ts_', 'js_', 'node_modules/*'],
  sync: true,
})

console.log('xxxx', inject)

const xxx = defineConfig({
  entry: inject,
  splitting: false,
  sourcemap: true,
  clean: true,
  outdir: 'dist',
  outbase: './src',
  minify: false,
  target: 'node16',
  format: ['esm'], // ['js', 'jsx', 'ts', 'tsx'].includes('js') ? undefined : 'esm', // ['esm'],
  loader: { '.js': 'jsx' },
  watch: 'forever',
  //dts: true, // manda in errore
  bundle: false,
  outExtension({ format }) {
    return { js: `.mjs` } // `.${format}.mjs`
  },
  esbuildPlugins: [sassPlugin(), svgrPlugin()],
  async onSuccess() {
    console.log('has done')
    createDeclaration()
  },
  esbuildOptions(options, context) {
    // options.loader = { '.js': 'jsx' }
    // console.log('iptions', options)
    options.outExtension = { '.js': '.mjs' }
    // options.format= ['js', 'jsx', 'ts', 'tsx'].includes('js') ? undefined : 'esm'
  },
  // esbuildPlugins: [nodeExternalsPlugin()],
})

build(xxx)
// console.log('xxxxxxxxxx', inject)
/* can import css

require('esbuild').buildSync({
  entryPoints: ['app.css'],
  bundle: true,
  outfile: 'main.css',
})
*/
