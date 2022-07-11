import { PkgTmpInstaller, _InstallPkgReq } from './types'
export type InstallPkgReq = NpmInstallReq | FolderInstallReq

export type NpmInstallReq = _InstallPkgReq<'npm', { registry: string }>
export const npmTmpInstaller: PkgTmpInstaller<NpmInstallReq> = npmInstallReq => {
  npmInstallReq
  throw new Error('not implemented')
}

export type FolderInstallReq = _InstallPkgReq<'folder', { fromFolder: string }>
export const folderTmpInstaller: PkgTmpInstaller<FolderInstallReq> = folderInstallReq => {
  folderInstallReq
  throw new Error('not implemented')
}
