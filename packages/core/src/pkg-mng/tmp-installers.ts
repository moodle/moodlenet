import { tmpdir } from 'os'
import { PkgTmpInstaller, _InstallPkgReq } from './types'
export type InstallPkgReq = NpmInstallReq | FolderInstallReq

export type NpmInstallReq = _InstallPkgReq<'npm', { registry: string; pkgId: string }>
export const npmTmpInstaller: PkgTmpInstaller<NpmInstallReq> = async npmInstallReq => {
  // make tmpfolder
  //const tmpInstallationFolder = tmpdir()
  npmInstallReq
  throw new Error('not implemented')
}

export type FolderInstallReq = _InstallPkgReq<'folder', { fromFolder: string }>
export const folderTmpInstaller: PkgTmpInstaller<FolderInstallReq> = async folderInstallReq => {
  // make tmpfolder

  const tmpInstallationFolder = tmpdir()
  folderInstallReq
  return { tmpInstallationFolder }
  //throw new Error('not implemented')
}
