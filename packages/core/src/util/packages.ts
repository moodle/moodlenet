import { SysPackages, SysPkgDeclNamed } from '../types/sys'

export function sysPackages2SysPkgDeclNamed(sysPkgs: SysPackages): SysPkgDeclNamed[] {
  return Object.entries(sysPkgs).map<SysPkgDeclNamed>(([name, sysPkg]) => ({ ...sysPkg, name }))
}
