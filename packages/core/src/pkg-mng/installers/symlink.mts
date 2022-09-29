import execa from 'execa'
import { getPackageIdIn } from '../lib.mjs'
import { PkgInstaller, SymlinkInstallReq } from './types.mjs'

export const symlinkInstaller: PkgInstaller<SymlinkInstallReq> = async ({
  installPkgReq: { fromFolder },
  pkgsFolder,
}) => {
  const pkgId = await getPackageIdIn({ pkgRootDir: fromFolder })
  console.log(`symlinkInstaller fromFolder:${fromFolder}`)
  await execa('npm', ['install', `file:${fromFolder}`], {
    cwd: pkgsFolder,
    timeout: 600000,
  })
  console.log(`symlinkInstaller done :${fromFolder}`)

  return { pkgId }
}
