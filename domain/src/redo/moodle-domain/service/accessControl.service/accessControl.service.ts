import * as moo from 'moodle-domain'

export type accessControl = moo.DefService<{
  model: moo.DefModel<AccessControlModel>
  tokens: never
}>

export type AccessControlModel = {
  configs: moo.IdSpaceMap<ConfigsSpace>
}

type ConfigsSpace = {
  permissions: moo.EntityData<'w', moo.Permissions>
}
