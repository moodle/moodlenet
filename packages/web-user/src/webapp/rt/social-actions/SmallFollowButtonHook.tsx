// import { AuthCtx } from '@moodlenet/web-user/webapp'
import { useContext, useMemo } from 'react'
import type { KnownEntityType } from '../../../common/types.mjs'
import type { SmallFollowButtonProps } from '../../ui/exports/ui.mjs'
import { useMyFeaturedEntityWitnCount } from '../context/useMyFeaturedEntityWithCount.js'
import { AuthCtx } from '../exports.mjs'

export const useSmallFollowButtonProps = ({
  _key,
  entityType,
}: {
  _key: string
  entityType: KnownEntityType
}): SmallFollowButtonProps | null => {
  const { isAuthenticated } = useContext(AuthCtx)
  const featuredHandle = useMyFeaturedEntityWitnCount({ _key, entityType, feature: 'follow' })

  const props = useMemo<SmallFollowButtonProps | null>(() => {
    if (!featuredHandle) {
      return null
    }
    const props: SmallFollowButtonProps = {
      followed: featuredHandle.isFeatured,
      canFollow: true,
      isCreator: false,
      isAuthenticated,
      toggleFollow: featuredHandle.toggle,
      numFollowers: featuredHandle.count,
    }
    return props
  }, [featuredHandle, isAuthenticated])

  return props
}
