import { InstallPkgReq, PkgIdentifier } from '../types.mjs'

export type _InstallPkgReq<Type extends InstallerType, More> = More & { type: Type }
export type NpmInstallReq = _InstallPkgReq<'npm', { registry: string; pkgId: PkgIdentifier }>
export type SymlinkInstallReq = _InstallPkgReq<'symlink', { fromFolder: string }>

export type InstallerType = 'symlink' | 'npm' //| 'file' | 'git'
export type PkgInstaller<Req extends InstallPkgReq> = (_: {
  installPkgReq: Req
  pkgsFolder: string
}) => Promise<{ pkgId: PkgIdentifier }>
