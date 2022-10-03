import execa from 'execa'
import { resolve } from 'path'
import { getPackageInfo } from '../lib.mjs'
import { NpmInstallReq, PkgInstaller } from './types.mjs'

export const npmInstaller: PkgInstaller<NpmInstallReq> = async ({ installPkgReq: { registry, pkgId }, pkgsFolder }) => {
  /* const installRes =  */ await execa('npm', ['install', '--registry', registry, `${pkgId.name}@${pkgId.version}`], {
    cwd: pkgsFolder,
    timeout: 600000,
  })
  const pkgRootDir = resolve(pkgsFolder, pkgId.name)
  const pkgInfo = getPackageInfo({ pkgRootDir })
  // assert(pkfInfo, `installed npm ${pkgId.name}@${pkgId.version}, but can't find pkgInfo on pkgRootDir: ${pkgRootDir}`)
  return { pkgInfo }
}
