import assert from 'assert'
import execa from 'execa'
import { stat } from 'fs/promises'
import { createRequire } from 'module'
import { dirname, posix, resolve, sep } from 'path'
import { sync as packageDirectorySync } from 'pkg-dir'
import type { PackageJson as NodePackageJson } from 'type-fest'
import type { PkgDiskInfo } from '../types'
import { PkgExport } from '../types'
import { MainFolders, PkgName, SysPkgDecl, SysPkgDeclNamed } from '../types/sys'
export type PkgMngLib = ReturnType<typeof makePkgMng>
export type InitResponse = 'newly-initialized-folder' | 'folder-was-already-npm-initialized'

export function makePkgMng(mainFolders: MainFolders) {
  const execa_opts: execa.Options = { cwd: mainFolders.deployment }
  const sysRequirePath = resolve(mainFolders.deployment, 'node_modules')
  console.log({ sysRequirePath })
  const sysRequire = createRequire(sysRequirePath)

  return {
    // info,
    install,
    uninstall,
    require: sysRequire,
    initWd,
    extractPackage,
    pkgDiskInfoOf,
    // findExt,
  }
  function extractPackage(pkgName: PkgName) {
    const pkgExport: PkgExport = sysRequire(pkgName).default
    const pkgDiskInfo = pkgDiskInfoOf(pkgName)
    return { pkgExport, pkgDiskInfo }
  }

  async function initWd(): Promise<InitResponse> {
    const wasInitialized = await stat(resolve(mainFolders.deployment, 'package.json')).then(
      _ => _.isFile(),
      () => false,
    )
    if (!wasInitialized) {
      await execa('npm', ['init', '-y'], execa_opts)
    }
    return wasInitialized ? 'folder-was-already-npm-initialized' : 'newly-initialized-folder'
  }

  function getPackageLocatorOpts(pkgName: PkgName, sysPkgDecl: SysPkgDecl) {
    switch (sysPkgDecl.type) {
      case 'file':
        return [sysPkgDecl.location]
      case 'npm':
        return [`--registry`, `${sysPkgDecl.registry}`, `${pkgName}@${sysPkgDecl.version}`]
      default:
        throw new Error('')
    }
  }

  async function install(sysPkgDeclNamed: SysPkgDeclNamed) {
    const args = ['i', '--json', '--force', '--save', ...getPackageLocatorOpts(sysPkgDeclNamed.name, sysPkgDeclNamed)]
    console.log(`installing ${sysPkgDeclNamed.name} from ${sysPkgDeclNamed.type}`)
    await execa('npm', args, execa_opts) //.then(console.log)
    return extractPackage(sysPkgDeclNamed.name)
  }

  function pkgDiskInfoOf(pkgName: PkgName): PkgDiskInfo {
    const mainModPath = sysRequire.resolve(pkgName)
    const main_mod_dir = dirname(mainModPath)

    const { pkgJson, rootDir } = pkgJsonOf(main_mod_dir)
    const name = pkgJson.name
    const version = pkgJson.version
    assert(name, `package.json for pkg in dir ${rootDir} has no name set`)
    assert(
      name === pkgName,
      `package.json#name(${name}) for pkg in dir ${rootDir} and pkgName(${pkgName}) are different`,
    )
    assert(version, `package.json for pkg in dir ${rootDir} has no version set`)

    const rootDirPosix = rootDir.split(sep).join(posix.sep)
    const pkgInfo: PkgDiskInfo = { rootDir, rootDirPosix, mainModPath, name, version }
    return pkgInfo
  }

  // function findExt<Def extends ExtDef>(pkgRegistry: PkgRegistry, findExtId: ExtId<Def>) {
  //   return pkgRegistry
  //     .map(pkgReg => {
  //       const matchingExts = pkgReg.exts.filter(currExt => {
  //         if (!areSameExtName(currExt.id, findExtId)) {
  //           return false
  //         }
  //         const findExtIdSplit = splitExtId(findExtId)
  //         const currExtIdSplit = splitExtId(currExt.id)
  //         const verMatch = isVerBWC(currExtIdSplit.version, findExtIdSplit.version)
  //         if (!verMatch) {
  //           return false
  //         }
  //         return currExt
  //       })
  //       if (!matchingExts.length) {
  //         return null
  //       }
  //       const match: ExtPackage = {
  //         ...pkgReg,
  //         exts: matchingExts,
  //       }
  //       return match
  //     })
  //     .filter((_): _ is ExtPackage => !!_)
  // }

  async function uninstall(pkgName: string) {
    return execa('npm', ['rm', pkgName], execa_opts)
  }

  // async function info(pkgId: string) {
  //   // const isFolder = pkgId.startsWith('file:')
  //   // if (isFolder) {
  //   //   const pkgJsonFile = resolve(pkgId.substring(5), 'package.json')
  //   //   // console.log({ pkgJsonFile })
  //   //   const pkgJson = require(pkgJsonFile)
  //   //   return {
  //   //     name: pkgJson.name,
  //   //     version: pkgJson.version,
  //   //   }
  //   // } else {
  //   const infoData = await execa('npm', ['info', '--json', pkgId]).then(resp => JSON.parse(resp.stdout).data)
  //   // console.log({ infoData })
  //   const name = infoData.name
  //   const version = infoData.version
  //   return {
  //     name,
  //     version,
  //   }
  //   // }
  // }
}

// FROM : https::github.com/dword-design/package-name-regex/blob/master/src/index.js
// const pkgNameRegex = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/
export function pkgJsonOf(dir: string) {
  const rootDir = packageDirectorySync(dir)
  assert(rootDir, `couldn't find or invalid package.json for dir:${dir}`)

  const pkgJson: NodePackageJson = require(resolve(rootDir, 'package.json'))
  return { pkgJson, rootDir }
}
