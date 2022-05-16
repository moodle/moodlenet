import execa from 'execa'
import { createRequire } from 'module'
import { Ext, PackageExt } from '../types'
import { pkgDiskInfoOf } from './info'
export type PkgMngLib = ReturnType<typeof makePkgMng>

export function makePkgMng(cwd: string) {
  const execa_opts: execa.Options = { cwd }
  const localRequire = createRequire(cwd)

  return {
    info,
    install,
    uninstall,
    localRequire,
  }

  async function install(pkgName: string, strict = true): Promise<PackageExt> {
    await execa('npm', ['i', '--force --save', ...(strict ? ['--strict-peer-deps'] : []), pkgName], execa_opts)
    const mainModPath = localRequire.resolve(pkgName)
    const pkgDiskInfo = pkgDiskInfoOf(mainModPath)
    if (pkgDiskInfo instanceof Error) {
      throw pkgDiskInfo
    }
    const exts: Ext[] = localRequire(pkgName).default
    const pkgRegistryRecord: PackageExt = {
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
