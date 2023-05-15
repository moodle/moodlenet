import type { WebappShell } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import {
  getEntityIdentifiers,
  getEntityIdentifiersByKey,
  isOfSameClass,
} from '../../common/entity-identification.mjs'
import type { EntityClass, EntityIdentifier } from '../../common/types.mjs'

export type MySystemEntitiesId<EntityTypeNames extends string> = {
  isIdOfType(id: string | EntityIdentifier, type: EntityTypeNames): boolean
  getIdentifiersByKey(_: { _key: string; type: EntityTypeNames }): {
    entityIdentifier: EntityIdentifier
    _id: string
  }
  // getIdentifiersById(_: { _id: string; type: EntityTypeNames }): {
  //   entityIdentifier: EntityIdentifier
  //   _id: string
  // }
}

export function useMySystemEntitiesId<EntityTypeNames extends string>({
  pkgId: { name: pkgName },
}: WebappShell<any>) {
  const mySystemEntitiesId = useMemo(() => {
    const isIdOfType: MySystemEntitiesId<EntityTypeNames>['isIdOfType'] = (id, type) => {
      const targetClass: EntityClass<any> = {
        pkgName,
        type,
      }

      const {
        entityIdentifier: { entityClass: idClass },
      } = getEntityIdentifiers(id)

      return isOfSameClass(idClass, targetClass)
    }

    const getIdentifiersByKey: MySystemEntitiesId<EntityTypeNames>['getIdentifiersByKey'] = ({
      _key,
      type,
    }) => {
      return getEntityIdentifiersByKey({ _key, pkgName, type })
    }

    const mySystemEntitiesId: MySystemEntitiesId<EntityTypeNames> = {
      isIdOfType,
      getIdentifiersByKey,
    }

    return mySystemEntitiesId
  }, [pkgName])
  return mySystemEntitiesId
}
