// import { AuthCtx } from '@moodlenet/web-user/webapp'
import { useContext } from 'react'
import type { KnownEntityType } from '../../../common/types.mjs'
import type { LikeButtonProps } from '../../ui/exports/ui.mjs'
import { AuthCtx } from '../context/AuthContext.js'
import { useMyFeaturedEntityWithCount } from '../context/useMyFeaturedEntityWithCount.js'

export const useLikeButtonProps = ({
  _key,
  entityType,
  info,
}: {
  _key: string
  entityType: KnownEntityType
  info: null | { name: string; isCreator: boolean }
}): LikeButtonProps => {
  const currentWebUser = useContext(AuthCtx)
  const featuredHandle = useMyFeaturedEntityWithCount({ feature: 'like', _key, entityType })

  const props: LikeButtonProps = {
    liked: !!featuredHandle.isFeatured,
    canLike: info ? !info.isCreator : false,
    isCreator: !!info?.isCreator,
    isAuthenticated: currentWebUser.isAuthenticated,
    toggleLike: featuredHandle.toggle,
    numLikes: featuredHandle.count,
  }
  return props

  return props
}
