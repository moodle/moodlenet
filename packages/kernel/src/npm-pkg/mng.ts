import execa from 'execa'
import { existsSync } from 'fs'
import { createRequire } from 'module'
import { resolve } from 'path'
import { Ext, ExtPackage } from '../types'
import { pkgDiskInfoOf } from './info'
export type PkgMngLib = ReturnType<typeof makePkgMng>

export function makePkgMng({ wd }: { wd: string }) {
  const execa_opts: execa.Options = { cwd: wd }
  const wdRequire = createRequire(resolve(wd, 'node_modules'))

  return {
    info,
    install,
    uninstall,
    require: wdRequire,
    initWd,
  }

  type InitResponse = 'first' | 'nochange'
  async function initWd(): Promise<InitResponse> {
    const wasInitialized = existsSync(resolve(wd, 'package.json'))
    if (!wasInitialized) {
      await execa('npm', ['init', '-y'], execa_opts)
    }
    return wasInitialized ? 'nochange' : 'first'
  }
  async function install(pkgLocator: string, strict = true): Promise<ExtPackage> {
    await execa('npm', ['i', '--force', '--save', ...(strict ? ['--strict-peer-deps'] : []), pkgLocator], execa_opts)
    const mainModPath = wdRequire.resolve(pkgLocator)
    const pkgDiskInfo = pkgDiskInfoOf(mainModPath)
    if (pkgDiskInfo instanceof Error) {
      throw pkgDiskInfo
    }
    const exts: Ext[] = wdRequire(pkgLocator).default
    const pkgRegistryRecord: ExtPackage = {
      pkgDiskInfo,
      exts,
    }
    return pkgRegistryRecord
  }

  async function uninstall(pkgName: string) {
    return execa('npm', ['rm', '--josn', pkgName], execa_opts)
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
