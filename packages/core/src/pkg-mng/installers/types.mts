import { PkgIdentifier } from '../../types.mjs'
import { InstallPkgReq, PackageInfo } from '../types.mjs'

export type _InstallPkgReq<Type extends InstallerType, More> = More & { type: Type }
export type NpmInstallReq = _InstallPkgReq<'npm', { registry: string; pkgId: PkgIdentifier<any> }>
export type SymlinkInstallReq = _InstallPkgReq<'symlink', { fromFolder: string }>

export type InstallerType = 'symlink' | 'npm' //| 'file' | 'git'
export type PkgInstaller<Req extends InstallPkgReq> = (_: {
  installPkgReq: Req
  pkgsFolder: string
}) => Promise<{ pkgInfo: PackageInfo }>
