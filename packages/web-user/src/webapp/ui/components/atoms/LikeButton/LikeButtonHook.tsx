// import { AuthCtx } from '@moodlenet/web-user/webapp'
import { useContext, useMemo, useState } from 'react'
import type { KnownEntityType } from '../../../../../common/types.mjs'
import { AuthCtx } from '../../../../context/AuthContext.js'
import { useSocialActionHook } from '../../../../FeaturedEntitiesHook.js'
import type { LikeButtonProps } from './LikeButton.js'

export const useLikeButtonProps = ({
  _key,
  entityType,
}: {
  _key: string
  entityType: KnownEntityType
}): LikeButtonProps | null => {
  const { isAuthenticated } = useContext(AuthCtx)
  const [liked, toggleLiked] = useSocialActionHook({ _key, entityType, feature: 'like' })
  const [numLikes, setNumLikes] = useState(0)

  const props = useMemo<LikeButtonProps>(() => {
    const toggleLike = () => {
      toggleLiked().then(() => setNumLikes(num => ++num))
    }

    const props: LikeButtonProps = {
      liked,
      canLike: true,
      isCreator: false,
      isAuthenticated,
      toggleLike,
      numLikes,
    }

    return props
  }, [isAuthenticated, liked, numLikes, toggleLiked])

  return props
}
