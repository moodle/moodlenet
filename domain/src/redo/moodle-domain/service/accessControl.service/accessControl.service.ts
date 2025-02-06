export type accessControl = moo.service<{
  model: moo.model<AccessControlModel>
  tokens: never
}>

export type AccessControlModel = {
  configs: moo.model.type.idSpaceMap<ConfigsSpace>
}

type ConfigsSpace = {
  permissions: moo.model.type.entityData<'w', moo.permissions.configs>
}
