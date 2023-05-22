// import { AuthCtx } from '@moodlenet/web-user/webapp'
import { useContext, useMemo, useState } from 'react'
import type { KnownEntityType } from '../../../../../common/types.mjs'
import { AuthCtx } from '../../../../context/AuthContext.js'
import { useMyFeaturedEntity } from '../../../../MyProfile/MyFeaturedEntities.js'
import type { LikeButtonProps } from './LikeButton.js'

export const useLikeButtonProps = ({
  _key,
  entityType,
}: {
  _key: string
  entityType: KnownEntityType
}): LikeButtonProps | null => {
  const { isAuthenticated } = useContext(AuthCtx)
  const { isFeatured, toggle } = useMyFeaturedEntity({ _key, entityType, feature: 'like' })
  const [numLikes, setNumLikes] = useState(0) // @ETTO use the service

  const props = useMemo<LikeButtonProps>(() => {
    const props: LikeButtonProps = {
      liked: isFeatured,
      canLike: true,
      isCreator: false,
      isAuthenticated,
      toggleLike,
      numLikes,
    }
    return props

    function toggleLike() {
      const deltaNumLikes = isFeatured ? -1 : 1
      toggle().then(() => setNumLikes(num => num + deltaNumLikes))
    }
  }, [isAuthenticated, isFeatured, numLikes, toggle])

  return props
}
