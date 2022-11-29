import { ApiDefs } from './apis/types.mjs'

export type PkgModuleRef = NodeModule | ImportMeta

export type PkgConnectionDef = {
  apis: ApiDefs
}
