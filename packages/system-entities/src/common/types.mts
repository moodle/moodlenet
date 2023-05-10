// type X = ProjectRes<{ patched: AqlVal<EntityDocument<SomeEntityDataType>> }>

export type SomeEntityDataType = Record<string, any>
export type EntityIdentifier = {
  _key: string
  entityClass: EntityClass<any>
}
export type EntityClass<_EntityDataType extends SomeEntityDataType> = {
  pkgName: string
  type: string
}
