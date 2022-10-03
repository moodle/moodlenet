import execa from 'execa'
import { getPackageInfo } from '../lib.mjs'
import { PkgInstaller, SymlinkInstallReq } from './types.mjs'

export const symlinkInstaller: PkgInstaller<SymlinkInstallReq> = async ({
  installPkgReq: { fromFolder },
  pkgsFolder,
}) => {
  const pkgInfo = await getPackageInfo({ pkgRootDir: fromFolder })
  console.log(`symlinkInstaller fromFolder:${fromFolder}`)
  await execa('npm', ['install', `file:${fromFolder}`], {
    cwd: pkgsFolder,
    timeout: 600000,
  })
  console.log(`symlinkInstaller done :${fromFolder}`)

  return { pkgInfo }
}
