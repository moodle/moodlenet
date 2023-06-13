import type { PkgName } from '@moodlenet/core'
import type { EntityIdentifier, SomeEntityDataType } from '../../common/types.mjs'
import { aqlGetPkgNamespace } from '../pkg-db-names.mjs'
import type {
  AqlVal,
  EntityDocFullData,
  EntityFullDocument,
  EntityMetadata,
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
  prop?: keyof EntityMetadata,
): AqlVal<EntityMetadata> {
  return `${entityVal}._meta${prop ? `.${prop}` : ''}`
}
export function entityKey(
  entityVal: AqlVal<EntityDocFullData<SomeEntityDataType>>,
): AqlVal<string> {
  return `${entityVal}._key`
}
export function entityId(entityVal: AqlVal<EntityDocFullData<SomeEntityDataType>>): AqlVal<string> {
  return `${entityVal}._id`
}
export const currentEntityClass = entityMeta(currentEntityVar, 'entityClass')
export const currentEntityMeta = entityMeta(currentEntityVar)
export const currentEntityKey = entityKey(currentEntityVar)
export const currentEntityId: AqlVal<string> = entityId(currentEntityVar)

export function creatorEntityIdentifier(
  entityVal: AqlVal<EntityDocFullData<SomeEntityDataType>>,
): AqlVal<EntityIdentifier> {
  return `( ${entityVal}.creator.entityIdentifier )`
}

export function isCurrentUserCreatorOfCurrentEntity(): AqlVal<boolean> {
  return `( ${currentEntityMeta}.creator.entityIdentifier == ${currentUserIdentifier} )`
}

export function isCreatorOfCurrentEntity(
  creatorEntityIdentifier: AqlVal<EntityIdentifier>,
): AqlVal<boolean> {
  return `( ${currentEntityMeta}.creator.entityIdentifier == ${creatorEntityIdentifier} )`
}

export function isCurrentUserEntity(): AqlVal<boolean> {
  return `( ${currentEntityKey} == ${currentUserIdentifier}._key && ${currentEntityMeta}.entityClass == ${currentUserIdentifier}.entityClass )`
}

export function isAuthenticated(): AqlVal<boolean> {
  return `( currentUser.type != 'anon' )`
}

export const creatorEntityIdVar = 'creatorEntityId'
export const creatorEntityDocVar = `creatorEntityDoc`

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
