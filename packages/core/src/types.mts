export type PkgModuleRef = NodeModule | ImportMeta

export type PkgIdentifier = {
  readonly name: PkgName
  readonly version: PkgVersion
}

export type PkgName = string
export type PkgVersion = string

export type CoreConfigs = {
  npmRegistry: string
  baseFsFolder: string
  instanceDomain: string
}
