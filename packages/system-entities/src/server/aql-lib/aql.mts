import { PkgName } from '@moodlenet/core'
import { aqlGetPkgNamespace } from '../pkg-db-names.mjs'
import type {
  AqlVal,
  EntityDocFullData,
  EntityDocument,
  EntityFullDocument,
  EntityIdentifier,
  EntityMetadata,
  SomeEntityDataType,
  SystemUser,
} from '../types.mjs'

// TODO: export a set of const for known vars for safer AQL construction ? (entity, entityClass, _meta, creator, currentUser)

export const currentSystemUserVar: AqlVal<SystemUser> = 'currentUser'
export function systemUserMeta(systemUserVal: AqlVal<SystemUser>): AqlVal<EntityMetadata> {
  return `${systemUserVal}._meta`
}

export function systemUserIdentifier(
  systemUserVal: AqlVal<SystemUser>,
): AqlVal<EntityIdentifier | null> {
  return `${systemUserVal}.entityIdentifier`
}

export const currentUserIdentifier: AqlVal<EntityIdentifier | null> =
  systemUserIdentifier(currentSystemUserVar)

export const currentEntityVar: AqlVal<EntityFullDocument<SomeEntityDataType>> = 'entity'
export function entityMeta(
  entityVal: AqlVal<EntityDocFullData<SomeEntityDataType>>,
): AqlVal<EntityMetadata> {
  return `${entityVal}._meta`
}
export function entityKey(
  entityVal: AqlVal<EntityDocFullData<SomeEntityDataType>>,
): AqlVal<string> {
  return `${entityVal}._key`
}
export function entityId(entityVal: AqlVal<EntityDocFullData<SomeEntityDataType>>): AqlVal<string> {
  return `${entityVal}._id`
}
export const currentEntityMeta = entityMeta(currentEntityVar)
export const currentEntityKey = entityKey(currentEntityVar)
export const currentEntityId: AqlVal<string> = entityId(currentEntityVar)

export function isCreator(): AqlVal<boolean> {
  return `( ${currentEntityMeta}.creator.entityIdentifier == ${currentUserIdentifier} )`
}

export function isCurrentUserEntity(): AqlVal<boolean> {
  return `( ${currentEntityKey} == ${currentUserIdentifier}._key && ${currentEntityMeta}.entityClass == ${currentUserIdentifier}.entityClass )`
}

export function isAuthenticated(): AqlVal<boolean> {
  return `( currentUser.type != 'anon' )`
}

export function creatorEntityDoc<T extends SomeEntityDataType>(): AqlVal<EntityDocument<T>> {
  return `DOCUMENT(${currentEntityMeta}.creatorEntityId )`
}

export function toaql<T>(any: T): AqlVal<T> {
  return `(${JSON.stringify(any ?? null)})`
}

export function entityIdentifier2EntityIdAql(entityIdentifierVar: AqlVal<EntityIdentifier>) {
  const pkgNamespaceAql = aqlGetPkgNamespace(`${entityIdentifierVar}.entityClass.pkgName`)
  return `CONCAT(${pkgNamespaceAql},'__',${entityIdentifierVar}.entityClass.type, "/", ${entityIdentifierVar}._key )`
}

export function entityDocByIdentifierAql(entityIdentifierVar: AqlVal<EntityIdentifier>) {
  const docId = entityIdentifier2EntityIdAql(entityIdentifierVar)
  return `DOCUMENT(${docId})`
}

export function pkgMetaOf<T>(
  entityMetaVal: AqlVal<EntityDocFullData<SomeEntityDataType>>,
  pkgNameVal: AqlVal<PkgName>,
): AqlVal<T> {
  return `${entityMeta(entityMetaVal)}.pkgMeta[${aqlGetPkgNamespace(pkgNameVal)}]`
}

export function currentEntityPkgMeta<T>(pkgNameVal: AqlVal<PkgName>): AqlVal<T> {
  return pkgMetaOf(currentEntityVar, pkgNameVal)
}
