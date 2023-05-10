import { usePkgContext } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import { getIdAndEntityIdentifier, isOfSameClass } from '../../common/entity-identification.mjs'
import type { EntityIdentifier } from '../../common/types.mjs'

export function usePkgEntityIds<EntityNames extends string>() {
  const { myId } = usePkgContext()

  const utils = useMemo(() => {
    return {
      isOfType,
    }
    function isOfType(id: string | EntityIdentifier, type: EntityNames) {
      const {
        entityIdentifier: { entityClass },
      } = getIdAndEntityIdentifier(id)
      return isOfSameClass(entityClass, { pkgName: myId.name, type })
    }
  }, [myId.name])

  return utils
}
