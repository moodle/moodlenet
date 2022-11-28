import { build } from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'
import { readdir, readFile } from 'fs/promises'
import { dirname, resolve } from 'path'
import execa from 'execa'
// import tsPaths from 'esbuild-ts-paths'
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
  plugins: [nodeExternalsPlugin()],
}

// build by tsconfig
// build({ plugins: [tsPaths('../../tsconfig-base.json')] }).catch(() => process.exit(1))

export default function builder(config) {
  console.log('package', pkg.name)
  console.time('timer')
  build({ ...buildDefault, ...{ outdir: './dist' }, ...config })
    .catch(() => process.exit(1))
    .then(res => {
      console.timeEnd('timer')
      execa('tscx', ['--emitDeclarationOnly'], {
        cwd: resolve(process.cwd(), ''),
        stdout: process.stdout,
      })
        .then(ex => console.log('', ex.command))
        .catch(error => console.log('error execa', error))
      res.warnings && console.log('warning', res.warnings)
    })
}

const inject = glob.sync('src/**/*.mts')
builder({ entryPoints: inject })

/* can import css

require('esbuild').buildSync({
  entryPoints: ['app.css'],
  bundle: true,
  outfile: 'main.css',
})
*/
