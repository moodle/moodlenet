import { fork } from 'child_process'
import objHash from 'object-hash'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { buildContext } from './build-context.mjs'
import { env } from './init/env.mjs'
import type { WebappBuildInfo } from './init/kvStore.mjs'
import { kvStore } from './init/kvStore.mjs'
import { shell } from './shell.mjs'
import { writeGenerated } from './webpack/webapp-plugins.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

if (!env.noWebappBuilder) {
  shell.log('info', `webapp build enabled on this instance, checking current build status ...`)
  const { pkgPlugins } = await writeGenerated()
  const pluginsHash = objHash(pkgPlugins)
  const buildInfo_building: WebappBuildInfo = { status: 'building', pluginsHash }
  const {
    old: { value: foundBuildInfo },
  } = await kvStore.set('build-info', '', buildInfo_building)

  if (foundBuildInfo && foundBuildInfo.pluginsHash === pluginsHash) {
    const statusMsg =
      foundBuildInfo.status === 'built'
        ? `webapp already built`
        : `another process is currently building`
    shell.log('info', `${statusMsg} - no operations required`)
    await kvStore.set('build-info', '', foundBuildInfo)
  } else {
    shell.log('info', `starting webapp build process`)
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
      const buildInfo_built: WebappBuildInfo = {
        status: 'built',
        lastBuild: new Date().toISOString(),
        pluginsHash,
      }
      shell.log('info', `webapp successfully built`, buildInfo_built)
      kvStore.set('build-info', '', buildInfo_built)
      wp_compile_process.kill('SIGKILL')
    })
    process.on('exit', () => {
      wp_compile_process.kill('SIGKILL')
    })
  }
}
