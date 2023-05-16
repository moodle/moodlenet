import type { PkgIdentifier } from '@moodlenet/core'
import {
  getEntityIdentifiers,
  getEntityIdentifiersById,
  getEntityIdentifiersByIdAssertClass,
  getEntityIdentifiersByKey,
  isOfSameClass,
} from './entity-identification.mjs'
import type { EntityIdentifier } from './types.mjs'

export function getPkgEntitiesTool<EntityTypeNames extends string>({
  pkgId,
}: {
  pkgId: PkgIdentifier
}) {
  const { name: pkgName } = pkgId

  return {
    isIdOfType,
    getIdentifiersByKey,
    getIdentifiersById,
    getIdentifiersByIdAssertType,
    mapToIdentifiersFilterType,
  }

  function getIdentifiersByKey<TypeName extends EntityTypeNames>({
    _key,
    type,
  }: {
    _key: string
    type: TypeName
  }) {
    return getEntityIdentifiersByKey({ _key, pkgName, type })
  }

  function getIdentifiersById<TypeName extends EntityTypeNames>({
    _id,
    type,
  }: {
    _id: string
    type: TypeName
  }) {
    return getEntityIdentifiersById({ _id, ensureClass: { pkgName, type } })
  }

  function getIdentifiersByIdAssertType<TypeName extends EntityTypeNames>({
    _id,
    type,
  }: {
    _id: string
    type: TypeName
  }) {
    return getEntityIdentifiersByIdAssertClass({ _id, ensureClass: { pkgName, type } })
  }

  function mapToIdentifiersFilterType<TypeName extends EntityTypeNames>({
    ids,
    type,
  }: {
    ids: (string | { _id: string } | EntityIdentifier)[]
    type: TypeName
  }) {
    return ids
      .map(_ => {
        const id = typeof _ === 'string' || '_key' in _ ? _ : _._id
        return getEntityIdentifiers(id)
      })
      .filter(({ entityIdentifier }) => isIdOfType({ id: entityIdentifier, type }))
  }

  function isIdOfType<TypeName extends EntityTypeNames>({
    id,
    type,
  }: {
    id: string | EntityIdentifier
    type: TypeName
  }) {
    const { entityIdentifier } = getEntityIdentifiers(id)

    return isOfSameClass(entityIdentifier.entityClass, {
      pkgName,
      type,
    })
  }
}
