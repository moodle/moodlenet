import { PackageJson } from 'type-fest'
import { InstallPkgReq } from './tmp-installers'

export type SafePackageJson = Omit<PackageJson, 'name' | 'version'> & { name: string; version: string }

export type PkgMngCfg = { pkgsFolder: string }

export type TmpInstallationInfo = {
  tmpInstallationFolder: string
}

export type InstallerType = 'folder' | 'npm' //| 'file' | 'git'
export type _InstallPkgReq<Type extends InstallerType, More> = More & { type: Type }
export type PkgTmpInstaller<Req extends InstallPkgReq> = (installPkgReq: Req) => Promise<TmpInstallationInfo>
