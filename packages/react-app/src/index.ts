/// <reference path="../moodlenet-react-app-lib.d.ts" />
import type { AuthenticationManagerExt } from '@moodlenet/authentication-manager'
import type { CoreExt, Ext, ExtDef, Port, SubTopo } from '@moodlenet/core'
import type { MNHttpServerExt } from '@moodlenet/http-server'
import { mkdir, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { resolve } from 'path'
import { ResolveOptions } from 'webpack'
import { generateCtxProvidersModule } from './generateCtxProvidersModule'
import { generateExposedModule } from './generateExposedModule'
import { generateRoutesModule } from './generateRoutesModule'
import { ExtPluginDef, ExtPluginsMap } from './types'
import { fixModuleLocForWebpackByOS } from './util'
import startWebpack from './webpackWatch'

export * from './types'
// const wpcfg = require('../webpack.config')
// const config: Configuration = wpcfg({}, { mode: 'development' })
const buildFolder = resolve(__dirname, '..', 'build')
const latestBuildFolder = resolve(__dirname, '..', 'latest-build')

export type ReactAppExtTopo = {
  webapp: {
    updated: SubTopo<void, void>
    recompiled: Port<'out', void>
  }
}
export type ReactAppExt = ExtDef<
  '@moodlenet/react-app',
  '0.1.0',
  ReactAppExtTopo,
  void,
  {
    setup(_: ExtPluginDef): void
  }
>
const tmpDir = resolve(tmpdir(), 'MN-react-app-modules')

const LibModuleFile = { alias: 'moodlenet-react-app-lib', target: resolve(tmpDir, 'lib.ts') }
const ExtRoutesModuleFile = {
  alias: 'ext-routes',
  target: resolve(tmpDir, 'ext-routes.ts'),
}
const ExposeModuleFile = {
  alias: 'ext-exposed-modules',
  target: resolve(tmpDir, 'exposedExtModules.ts'),
}
const ExtContextProvidersModuleFile = {
  alias: 'ext-context-providers-modules',
  target: resolve(tmpDir, 'extContextProvidersModules.tsx'),
}
const ext: Ext<ReactAppExt, [CoreExt, MNHttpServerExt, AuthenticationManagerExt]> = {
  name: '@moodlenet/react-app',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0', '@moodlenet/http-server@0.1.0', '@moodlenet/authentication-manager@0.1.0'],
  async deploy(shell) {
    shell.expose({ 'webapp/updated/sub': { validate: () => ({ valid: true }) } })

    shell.plugin<MNHttpServerExt>('@moodlenet/http-server@0.1.0', (plug /* , depl */) => {
      const { express, mount } = plug
      mount({ getApp, absMountPath: '/' })
      function getApp() {
        const mountApp = express()
        const staticWebApp = express.static(latestBuildFolder, { index: 'index.html' })
        mountApp.use(staticWebApp)
        mountApp.get(`*`, (req, res, next) => {
          if (req.url.startsWith('/_/')) {
            next()
            return
          }
          res.sendFile(resolve(latestBuildFolder, 'index.html'))
        })
        return mountApp
      }
    })
    await mkdir(tmpDir, { recursive: true })
    await mkdir(buildFolder, { recursive: true })
    const extPluginsMap: ExtPluginsMap = {}
    await writeAliasModules()
    const baseResolveAlias: ResolveOptions['alias'] = {
      'rxjs': resolve(__dirname, '..', 'node_modules', 'rxjs'),
      'react': resolve(__dirname, '..', 'node_modules', 'react'),
      'react-router-dom': resolve(__dirname, '..', 'node_modules', 'react-router-dom'),
      'react-dom': resolve(__dirname, '..', 'node_modules', 'react-dom'),
      [ExtRoutesModuleFile.alias]: ExtRoutesModuleFile.target,
      [ExposeModuleFile.alias]: ExposeModuleFile.target,
      [ExtContextProvidersModuleFile.alias]: ExtContextProvidersModuleFile.target,
      [LibModuleFile.alias]: LibModuleFile.target,
    }
    console.log({ baseResolveAlias })
// start webpack packages/react-app/src/webpackWatch.ts
    const wp = await startWebpack({ buildFolder, latestBuildFolder, baseResolveAlias })
    wp.compiler.hooks.afterDone.tap('recompilation event', _stats => {
      shell.emit('webapp/recompiled')()
    })
    shell.provide.services({
      'webapp/updated'() {
        return shell.msg$.pipe(
          shell.rx.filter(msg =>
            shell.lib.matchMessage<ReactAppExt>()(msg, '@moodlenet/react-app@0.1.0::webapp/recompiled'),
          ),
          shell.rx.map(() => void 0),
        )
      },
    })
    return {
      plug({ depl }) {
        return {
          setup(plugin) {
            console.log('...setup', depl.shell.extId, plugin)
            extPluginsMap[depl.shell.extId] = {
              ...plugin,
              extName: depl.ext.name,
              extVersion: depl.ext.version,
              extId: depl.shell.extId,
            }
            // console.log({ '***': wp.compiler.options.resolve.alias })
            if (plugin.addPackageAlias) {
              const { loc, name } = plugin.addPackageAlias
              wp.compiler.options.resolve.alias = {
                ...wp.compiler.options.resolve.alias,
                [name]: loc,
              }
            }
            writeAliasModulesAndRecompile()
            console.log({ aloiases: wp.compiler.options.resolve.alias })
            depl.shell.tearDown.add(() => {
              console.log('removing react plugins')
              if (plugin.addPackageAlias) {
                const newAliases: any = {
                  ...wp.compiler.options.resolve.alias,
                }
                delete newAliases[plugin.addPackageAlias.name]
                wp.compiler.options.resolve.alias = newAliases
              }
              delete extPluginsMap[depl.shell.extId]
              writeAliasModulesAndRecompile()
            })
          },
        }
      },
    }
    async function writeAliasModulesAndRecompile() {
      await writeAliasModules()
      wp.compiler.watching.invalidate(() => console.log('INVALIDATED'))
    }
    function writeAliasModules() {
      console.log('writeAliasModules!', extPluginsMap)
      return Promise.all([
        writeFile(ExtRoutesModuleFile.target, generateRoutesModule({ extPluginsMap })),
        writeFile(ExposeModuleFile.target, generateExposedModule({ extPluginsMap })),
        writeFile(ExtContextProvidersModuleFile.target, generateCtxProvidersModule({ extPluginsMap })),
        writeFile(
          LibModuleFile.target,
          `
            import lib from '${fixModuleLocForWebpackByOS(resolve(__dirname, '..', 'src', 'react-app-lib'))}'
            export default lib
          `,
        ),
      ])
    }
  },
}

export default ext
