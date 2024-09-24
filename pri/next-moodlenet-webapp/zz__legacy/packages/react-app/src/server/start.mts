import { fork } from 'child_process'
import { access, mkdir, readdir, rm } from 'fs/promises'
import objHash from 'object-hash'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { buildContext } from './build-context.mjs'
import { env } from './init/env.mjs'
import type { WebappBuildInfo } from './init/kvStore.mjs'
import { kvStore } from './init/kvStore.mjs'
import { shell } from './shell.mjs'
import { isLockFilePresent, lockFile } from './webpack/lockFile.mjs'
import { writeGenerated } from './webpack/webapp-plugins.mjs'

const MIN_AMOUNT_OF_FILES_FOR_HEURISTIC_EVALUATION_OF_LATEST_BUILD_FOLDER_CONTENT = 10
const __dirname = dirname(fileURLToPath(import.meta.url))

if (!env.noWebappBuilder) {
  shell.log('info', `webapp build enabled on this instance, checking current build status ...`)
  const { pkgPlugins } = await writeGenerated()
  const pluginsHash = objHash(pkgPlugins)
  const buildInfo_building: WebappBuildInfo = { status: 'building', pluginsHash }
  const {
    old: { value: foundBuildInfo },
  } = await kvStore.set('build-info', '', buildInfo_building)

  shell.log('debug', { foundBuildInfo })

  const shouldBuild_heruistic =
    !foundBuildInfo ||
    foundBuildInfo.pluginsHash !== pluginsHash ||
    (await access(buildContext.latestBuildFolder).then(
      async () =>
        foundBuildInfo.status === 'building'
          ? !(await isLockFilePresent(buildContext.latestBuildFolder))
          : (await readdir(buildContext.latestBuildFolder)).length <
            MIN_AMOUNT_OF_FILES_FOR_HEURISTIC_EVALUATION_OF_LATEST_BUILD_FOLDER_CONTENT,
      () => true,
    ))

  if (shouldBuild_heruistic) {
    shell.log('info', `starting webapp build process`)
    await rm(buildContext.latestBuildFolder, {
      force: true,
      recursive: true,
      maxRetries: 10,
      retryDelay: 100,
    })
    await mkdir(buildContext.latestBuildFolder, { recursive: true })
    _lockFile(true)
    const wp_compile_process = fork(resolve(__dirname, 'webpack', '-prod-compile.mjs'), {
      cwd: buildContext.baseBuildFolder,
    })

    wp_compile_process.once('error', err => {
      shell.log('error', `webpack compiler error ... ${err}`)
    })
    wp_compile_process.once('exit', async sig => {
      _lockFile(false)
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
      shell.log('info', `webapp successfully built.`, buildInfo_built)
      kvStore.set('build-info', '', buildInfo_built)
      wp_compile_process.kill('SIGTERM')
    })
    process.on('exit', () => {
      _lockFile(false)
      wp_compile_process.kill('SIGTERM')
    })
  } else {
    const statusMsg =
      foundBuildInfo.status === 'built'
        ? `webapp already built`
        : `another process is currently building`
    shell.log('info', `${statusMsg} - no operations required`)
    await kvStore.set('build-info', '', foundBuildInfo)
  }
}

function _lockFile(set: boolean) {
  return lockFile(buildContext.latestBuildFolder, set)
}
