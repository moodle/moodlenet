import * as moo from 'moodle-domain'

export type accessControl = moo.DefService<{
  model: moo.DefModel<AccessControlModel>
  tokens: never
}>

export interface AccessControlModel {
  configs: moo.IdSpaceMap<ConfigsSpace>
}

interface ConfigsSpace {
  permissions: moo.EntityData<'w', moo.Permissions>
}
