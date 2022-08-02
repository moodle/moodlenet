import { symlink } from 'fs/promises'
import { getPackageInfo } from '../lib'
import { getInstallationFolder } from './lib'
import { PkgInstaller, SymlinkInstallReq } from './types'

export const symlinkInstaller: PkgInstaller<SymlinkInstallReq> = async ({
  installPkgReq: { fromFolder },
  pkgsFolder,
  useFolderName,
}) => {
  const { packageJson } = await getPackageInfo({ absFolder: fromFolder })
  const pkgId = packageJson.name
  const { absInstallationFolder, pkgInstallationId } = await getInstallationFolder({
    pkgsFolder,
    pkgId,
    useFolderName,
  })
  console.log('**', { pkgInstallationId, absInstallationFolder, fromFolder })
  await symlink(fromFolder, absInstallationFolder, 'dir')
  return { pkgInstallationId }
}
