import { InstallPkgReq, PkgInstallationId } from '../types'

export type NpmInstallReq = _InstallPkgReq<'npm', { registry: string; pkgId: string }>
export type SymlinkInstallReq = _InstallPkgReq<'symlink', { fromFolder: string }>

export type InstallerType = 'symlink' | 'npm' //| 'file' | 'git'
export type _InstallPkgReq<Type extends InstallerType, More> = More & { type: Type }
export type PkgInstaller<Req extends InstallPkgReq> = (_: {
  installPkgReq: Req
  pkgsFolder: string
  useFolderName?: string
}) => Promise<{ pkgInstallationId: PkgInstallationId }>
