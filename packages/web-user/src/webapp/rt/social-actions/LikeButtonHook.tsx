// import { AuthCtx } from '@moodlenet/web-user/webapp'
import { useContext, useMemo } from 'react'
import type { KnownEntityType } from '../../../common/types.mjs'
import type { LikeButtonProps } from '../../ui/exports/ui.mjs'
import { AuthCtx } from '../context/AuthContext.js'
import { useMyFeaturedEntityWitnCount } from '../context/useMyFeaturedEntityWithCount.js'

export const useLikeButtonProps = ({
  _key,
  entityType,
}: {
  _key: string
  entityType: KnownEntityType
}): LikeButtonProps | null => {
  const { isAuthenticated } = useContext(AuthCtx)
  const featuredHandle = useMyFeaturedEntityWitnCount({ _key, entityType, feature: 'like' })

  const props = useMemo<LikeButtonProps | null>(() => {
    if (!featuredHandle) {
      return null
    }
    const props: LikeButtonProps = {
      liked: featuredHandle.isFeatured,
      canLike: true,
      isCreator: false,
      isAuthenticated,
      toggleLike: featuredHandle.toggle,
      numLikes: featuredHandle.count,
    }
    return props
  }, [featuredHandle, isAuthenticated])

  return props
}
