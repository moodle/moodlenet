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
  format: ['js', 'jsx', 'ts', 'tsx'].includes('js') ? undefined : 'esm',
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

export function builder(config) {
  console.log('package', pkg.name)
  console.time('timer')
  build({ ...buildDefault, ...{ outdir: './dist' }, ...config })
    .catch(() => process.exit(1))
    .then(res => {
      console.timeEnd('timer')
      createDeclaration()
      res.warnings && console.log('warning', res.warnings)
    })
}

// const inject = glob.sync('src/**/*.mts', 'src/**/*.tsx')
//const inject = glob.sync('src/**/*.+(mts|tsx|ts)')
const inject = glob.sync('src/**/*.*')
// builder({ entryPoints: inject })

const xxx = defineConfig({
  entry: inject,
  splitting: false,
  sourcemap: true,
  clean: true,
  outdir: 'dist',
  outbase: './src',
  minify: false,
  target: 'node16',
  format: ['esm'],
  loader: { '.js': 'jsx' },
  watch: 'forever',
  //dts: true, // manda in errore
  // outExtension: { '.js': '.mjs' },
  bundle: false,
  outExtension({ format }) {
    //console.log('xxxxx', aaa)
    return { js: `.mjs` }
    // return { js: `.${format}.mjs` }
  },
  esbuildPlugins: [sassPlugin(), svgrPlugin()],
  async onSuccess() {
    console.log('has done')
    createDeclaration()
  },
  esbuildOptions(options, context) {
    // options.loader = { '.js': 'jsx' }
    // console.log('iptions', options)
    // options.outExtension={ '.js': '.mjs' }
    // options.format= ['js', 'jsx', 'ts', 'tsx'].includes('js') ? undefined : 'esm'
  },
  // esbuildPlugins: [nodeExternalsPlugin()],
})

build(xxx)
console.log('xxxxxxxxxx', inject)
/* can import css

require('esbuild').buildSync({
  entryPoints: ['app.css'],
  bundle: true,
  outfile: 'main.css',
})
*/
