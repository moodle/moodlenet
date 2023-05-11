import { usePkgContext } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import { getIdAndEntityIdentifier, isOfSameClass } from '../../common/entity-identification.mjs'
import type { EntityClass, EntityIdentifier } from '../../common/types.mjs'

export type MySystemEntitiesId<EntityTypeNames extends string> = {
  isIdOfType(id: string | EntityIdentifier, type: EntityTypeNames): boolean
}

export function useMySystemEntitiesId<EntityTypeNames extends string>() {
  const {
    myId: { name: pkgName },
  } = usePkgContext()
  const mySystemEntitiesId = useMemo(() => {
    const isIdOfType: MySystemEntitiesId<EntityTypeNames>['isIdOfType'] = (id, type) => {
      const targetClass: EntityClass<any> = {
        pkgName,
        type,
      }

      const {
        entityIdentifier: { entityClass: idClass },
      } = getIdAndEntityIdentifier(id)

      return isOfSameClass(idClass, targetClass)
    }

    const mySystemEntitiesId: MySystemEntitiesId<EntityTypeNames> = {
      isIdOfType,
    }

    return mySystemEntitiesId
  }, [pkgName])
  return mySystemEntitiesId
}
