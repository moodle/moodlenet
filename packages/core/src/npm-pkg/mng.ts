import execa from 'execa'
import { stat } from 'fs/promises'
import { createRequire } from 'module'
import { resolve, sep } from 'path'
import { Ext, ExtPackage, PkgDiskInfo } from '../types'
import { pkgDiskInfoOf } from './info'
export type PkgMngLib = ReturnType<typeof makePkgMng>
export type InitResponse = 'newly-initialized-folder' | 'folder-was-already-npm-initialized'

export function makePkgMng({ wd }: { wd: string }) {
  const execa_opts: execa.Options = { cwd: wd }
  const wdRequire = createRequire(resolve(wd, 'node_modules'))

  return {
    info,
    installAndExtract,
    install,
    extract,
    uninstall,
    require: wdRequire,
    initWd,
  }

  async function initWd(): Promise<InitResponse> {
    const wasInitialized = await stat(resolve(wd, 'package.json')).then(
      _ => _.isFile(),
      () => false,
    )
    if (!wasInitialized) {
      await execa('npm', ['init', '-y'], execa_opts)
    }
    return wasInitialized ? 'folder-was-already-npm-initialized' : 'newly-initialized-folder'
  }

  async function installAndExtract({
    pkgLocator,
    strict = true,
  }: {
    pkgLocator: string
    strict?: boolean
  }): Promise<ExtPackage> {
    const pkgDiskInfo = await install({ strict, pkgLocator })
    return await extract(pkgDiskInfo)
  }

  async function install({ pkgLocator, strict = true }: { pkgLocator: string; strict?: boolean }) {
    await execa('npm', ['i', '--force', '--save', ...(strict ? ['--strict-peer-deps'] : []), pkgLocator], execa_opts)
    const mainModPath = pkgLocator.startsWith('file:')
      ? `${pkgLocator.replace('file:', '')}${sep}package.json`
      : wdRequire.resolve(pkgLocator)
    const pkgDiskInfo = pkgDiskInfoOf(mainModPath)
    if (pkgDiskInfo instanceof Error) {
      throw pkgDiskInfo
    }
    return pkgDiskInfo
  }

  async function extract(pkgDiskInfo: PkgDiskInfo) {
    // console.log(mainModPath, pkgDiskInfo)
    const exts: Ext[] = wdRequire(pkgDiskInfo.name).default
    const pkgRegistryRecord: ExtPackage = {
      pkgDiskInfo,
      exts,
    }
    return pkgRegistryRecord
  }

  async function uninstall(pkgName: string) {
    return execa('npm', ['rm', pkgName], execa_opts)
  }

  async function info(pkgId: string) {
    // const isFolder = pkgId.startsWith('file:')
    // if (isFolder) {
    //   const pkgJsonFile = resolve(pkgId.substring(5), 'package.json')
    //   // console.log({ pkgJsonFile })
    //   const pkgJson = require(pkgJsonFile)
    //   return {
    //     name: pkgJson.name,
    //     version: pkgJson.version,
    //   }
    // } else {
    const infoData = await execa('npm', ['info', '--json', pkgId]).then(resp => JSON.parse(resp.stdout).data)
    // console.log({ infoData })
    const name = infoData.name
    const version = infoData.version
    return {
      name,
      version,
    }
    // }
  }
}

// FROM : https::github.com/dword-design/package-name-regex/blob/master/src/index.js
// const pkgNameRegex = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/
