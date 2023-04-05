import type { PkgName } from '@moodlenet/core'
import { EntityInfo, ENTITY_INFO_PROVIDERS } from '../entity-info.mjs'
import { includesSameClass } from '../lib.mjs'
import { entityId, getPkgNamespace, getPkgNamespaceAql } from '../pkg-db-names.mjs'
import type {
  AqlVal,
  EntityClass,
  EntityDocument,
  EntityIdentifier,
  SomeEntityDataType,
} from '../types.mjs'

// TODO: export a set of const for known vars for safer AQL construction ? (entity, entityClass, _meta, creator, currentUser)

export function isCreator(): AqlVal<boolean> {
  return `( entity._meta.creator.entityIdentifier == currentUser.entityIdentifier )`
}

export function isCurrentUserEntity(): AqlVal<boolean> {
  return `( entity._key == currentUser.entityIdentifier._key && entity._meta.entityClass == currentUser.entityIdentifier.entityClass )`
}

export function isEntity(entityIdentifier: EntityIdentifier): AqlVal<boolean> {
  const _str_key = toaql(entityIdentifier._key)
  const _str_entityClass = toaql(entityIdentifier.entityClass)
  return `( entity._key == ${_str_key} && entity._meta.entityClass == ${_str_entityClass} )`
}

export function isAuthenticated(): AqlVal<boolean> {
  return `( currentUser.type != 'anon' )`
}

export function isEntityClass(
  entityClasses: EntityClass<SomeEntityDataType> | EntityClass<SomeEntityDataType>[],
): AqlVal<boolean> {
  const isArray = Array.isArray(entityClasses)
  const entityClassesStr = toaql(entityClasses)
  return `( ${entityClassesStr} ${isArray ? 'any ' : ''} == entity._meta.entityClass )`
}

export function entityDocument<T extends SomeEntityDataType>(
  entityIdentifier: EntityIdentifier,
): AqlVal<EntityDocument<T>> {
  return `DOCUMENT( "${entityId(entityIdentifier)}" )`
}

export function creatorEntityDoc<T extends SomeEntityDataType>(): AqlVal<EntityDocument<T>> {
  return `DOCUMENT(entity._meta.creatorEntityId )`
}

export function pkgMetaOf<T>(pkgName: PkgName): AqlVal<T> {
  return `entity._meta.pkgMeta["${getPkgNamespace(pkgName)}"]`
}

export function entityIdentifier2EntityIdAql(entityIdentifierVar: string) {
  const pkgNamespaceAql = getPkgNamespaceAql(`${entityIdentifierVar}.entityClass.pkgName`)
  return `CONCAT(${pkgNamespaceAql},'__',${entityIdentifierVar}.entityClass.type, "/", ${entityIdentifierVar}._key )`
}

export function entityDocByIdentifierAql(entityIdentifierVar: string) {
  const docId = entityIdentifier2EntityIdAql(entityIdentifierVar)
  return `DOCUMENT(${docId})`
}
export function userInfoAqlProvider(
  systemUserVar: string,
  opts?: { restrictToEntityClasses?: EntityClass<SomeEntityDataType>[] },
): AqlVal<EntityInfo> {
  const providersRows = ENTITY_INFO_PROVIDERS.filter(({ providerItem: { entityClass } }) =>
    !opts?.restrictToEntityClasses
      ? true
      : includesSameClass(entityClass, opts?.restrictToEntityClasses),
  ).map(({ providerItem: { aqlProvider, entityClass } }) => {
    const isSameClass = `${toaql(entityClass)} == ${systemUserVar}.entityIdentifier.entityClass`
    const resolvedInfo = aqlProvider('creatorDoc')
    return `( ${isSameClass} ? ( ${resolvedInfo} ) : null )`
  })
  const providersArrayAql = `[ ${providersRows.join(' , ')} ]`
  const entityProvidersAql = `(( 
    LET creatorDoc = DOCUMENT(creatorEntityId)
    FOR entityInfo in ${providersArrayAql} FILTER !!entityInfo LIMIT 1 RETURN entityInfo )[0])`
  const aql = `(
    ${systemUserVar}.type == 'entity' ? ${entityProvidersAql} 
    : ${systemUserVar}.type == 'root' ? { iconUrl: '', name: 'ROOT', homepagePath: '' }
    : /* type == 'pkg' */ { iconUrl: '', name: ${systemUserVar}.pkgName, homepagePath: '' }
  )`
  return aql
}

export function creatorUserInfoAqlProvider(): AqlVal<EntityInfo> {
  return userInfoAqlProvider('entity._meta.creator')
}

export function toaql<T>(any: unknown): AqlVal<T> {
  return any === void 0 ? 'undefined' : JSON.stringify(any)
}
