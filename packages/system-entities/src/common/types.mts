export type SomeEntityDataType = Record<string, any>
export type EntityIdentifier = {
  _key: string
  entityClass: EntityClass<any>
}
export type EntityClass<_EntityDataType extends SomeEntityDataType> = {
  pkgName: string
  type: string
}

export type EntityIdentifiers = { _id: string; entityIdentifier: EntityIdentifier }
