import { fork } from 'child_process'
import { access } from 'fs/promises'
import objHash from 'object-hash'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { buildContext } from './build-context.mjs'
import { kvStore } from './init/kvStore.mjs'
import { shell } from './shell.mjs'
import { writeGenerated } from './webapp-plugins.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

/*
WIP DEV ..
may consider another env flag : noWebappBuilder ?
 */
const { pkgPlugins } = await writeGenerated()
const pluginsHash = objHash(pkgPlugins)
const { old } = await kvStore.set('build-info', '', { status: 'building', pluginsHash })
const isBuildPresent = await access(buildContext.buildFolder).then(
  () => true,
  () => false,
)

if (isBuildPresent && old.value?.pluginsHash === pluginsHash && old.value.status === 'built') {
  shell.log('info', `webapp already built`)
  await kvStore.set('build-info', '', old.value)
} else if (!isBuildPresent || old.value?.status !== 'building') {
  shell.log('info', `webapp needs build`)
  const wp_compile_process = fork(resolve(__dirname, 'webpack', '-prod-compile.mjs'), {
    cwd: buildContext.baseBuildFolder,
  })
  wp_compile_process.once('error', err => {
    shell.log('error', `webpack compiler error ... ${err}`)
  })
  wp_compile_process.once('exit', async sig => {
    const done = sig === 0
    if (!done) {
      shell.log('critical', `webapp not compiled. webpack exited with signal ${sig}`)
      await kvStore.unset('build-info', '')
      return
    }

    shell.log('info', `webpacked webapp`)
    kvStore.set('build-info', '', {
      status: 'built',
      lastBuild: new Date().toISOString(),
      pluginsHash,
    })
    wp_compile_process.kill('SIGKILL')
  })
  process.on('exit', () => {
    wp_compile_process.kill('SIGKILL')
  })
}
