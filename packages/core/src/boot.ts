import type { Ext, ExtBag, PkgInfo } from '@moodlenet/kernel'
import { core as k } from '@moodlenet/kernel'
import { createRequire } from 'module'
import { dirname, resolve } from 'path'
import './main/env'

const { sync: packageDirectorySync } = require('pkg-dir')
export type InitialInstallCfg = {}

// console.log({ pkgDir })
interface BootCfg {
  deploymentFolder: string
  // initialPeerPkgsInstallRes?: InstallRes[]
}

export async function boot({ deploymentFolder /* , initialPeerPkgsInstallRes  */ }: BootCfg) {
  console.log('boot ... ', { deploymentFolder /* , initialPeerPkgsInstallRes  */ })
  const { extEnvVars /* , devMode  */ } = prepareConfigs()
  const K = await k.create({ extEnvVars })
  const req = createRequire(resolve(deploymentFolder, 'node_modules'))
  const pkgJson = require(resolve(deploymentFolder, 'package.json'))
  const deps: string[] = Object.keys(pkgJson.dependencies).filter(_ => _ !== '@moodlenet/kernel')
  // console.log({ deps })
  const extBags: ExtBag[] = deps.flatMap(dep => {
    const depMainPath = req.resolve(dep)
    const depMainPathDir = dirname(depMainPath)
    const depRootFolder = packageDirectorySync(depMainPathDir)
    // console.log({ dep, depRootFolder, depMainPathDir, depMainPath })
    const depPkgJson = req(resolve(depRootFolder, 'package.json'))
    const depPkgInfo: PkgInfo = {
      name: depPkgJson.name,
      version: depPkgJson.version,
    }
    const exts: Ext[] = req(dep).default
    const x = exts.map<ExtBag>(ext => ({
      pkgInfo: depPkgInfo,
      ext,
    }))
    return x
  })
  K.enableAndDeployExtensions({ extBags })
  return

  function prepareConfigs() {
    const DEV_MODE_VALUE = 'development'
    const NODE_ENV = process.env.NODE_ENV ?? DEV_MODE_VALUE
    const devMode = NODE_ENV === DEV_MODE_VALUE
    const EXT_ENV_PATH = process.env.EXT_ENV ?? `${deploymentFolder}/ext-env`
    const extEnvVars: Record<string, any> = require(EXT_ENV_PATH)

    return {
      extEnvVars,
      devMode,
    }
  }
}
