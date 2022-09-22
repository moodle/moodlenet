import execa from 'execa'
import { NpmInstallReq, PkgInstaller } from './types.mjs'

export const npmInstaller: PkgInstaller<NpmInstallReq> = async ({ installPkgReq: { registry, pkgId }, pkgsFolder }) => {
  /* const installRes =  */ await execa('npm', ['install', '--registry', registry, `${pkgId.name}@${pkgId.version}`], {
    cwd: pkgsFolder,
    timeout: 600000,
  })

  return { pkgId }
}
