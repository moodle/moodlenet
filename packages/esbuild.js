// import * as pkg from './package.json'
import { build } from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'
import { readdir, readFile } from 'fs/promises'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import glob from 'glob'

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

const inject = glob.sync('src/*.mts')

const buildDefault = {
  outdir: './dist/',
  minify: false,
  bundle: false,
  outbase: './src',
  format: 'esm',
  target: 'node16',
  // external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
  plugins: [nodeExternalsPlugin()],
}

export default function builder(config) {
  console.log('package', pkg.name)
  console.time('timer')
  build({ ...buildDefault, ...{ outdir: './dist' }, ...config })
    .catch(() => process.exit(1))
    .then(() => {
      console.timeEnd('timer')
    })
}

builder({ entryPoints: inject })
