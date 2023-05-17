// import { AuthCtx } from '@moodlenet/web-user/webapp'
import { useContext, useMemo, useState } from 'react'
import { AuthCtx } from '../../../../context/AuthContext.js'
import { shell } from '../../../../shell.mjs'
import type { LikeButtonProps } from './LikeButton.js'

type MyProps = LikeButtonProps & { numLikes: number }

export const useLikeButtonProps = ({ profileKey }: { profileKey: string }): MyProps | null => {
  const { isAuthenticated } = useContext(AuthCtx)
  const [liked, setLiked] = useState(false)
  const [numLikes, setNumLikes] = useState(0)

  const props = useMemo(() => {
    //  if (!pageProgs) return null
    const toggleLike = () => {
      shell.rpc.me[
        'webapp/feature-entity/:action(add|remove)/:feature(bookmark|follow|like)/:entity_id'
      ](undefined, { action: `add`, feature: 'like', entity_id: profileKey }).then(() => {
        setLiked(!liked), setNumLikes(!liked ? numLikes + 1 : numLikes - 1)
      })
    }
    const props: MyProps = {
      liked,
      canLike: true,
      isCreator: true,
      isAuthenticated,
      toggleLike,
      numLikes,
    }

    return props
  }, [isAuthenticated, liked, numLikes, profileKey])

  return props
}
