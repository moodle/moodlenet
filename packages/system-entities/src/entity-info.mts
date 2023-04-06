import { AqlVal, EntityClass, SomeEntityDataType } from './types.mjs'

export type EntityInfo = {
  iconUrl: string
  name: string
  homepagePath: string
}
export type EntityInfoProviderItem = {
  entityClass: EntityClass<SomeEntityDataType>
  aqlProvider: EntityInfoAqlProvider
}
export type EntityInfoAqlProvider = (entityDocVar: string) => AqlVal<EntityInfo>
export const ENTITY_INFO_PROVIDERS: { providerItem: EntityInfoProviderItem }[] = []
