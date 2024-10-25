// import { AuthCtx } from '@moodlenet/web-user/webapp'
import { useContext } from 'react'
import type { KnownEntityType } from '../../../common/types.mjs'
import type { SmallFollowButtonProps } from '../../ui/exports/ui.mjs'
import { useMyFeaturedEntityWithCount } from '../context/useMyFeaturedEntityWithCount'
import { AuthCtx } from '../exports.mjs'

export const useSmallFollowButtonProps = ({
  _key,
  entityType,
  info,
}: {
  _key: string
  entityType: KnownEntityType
  info: null | undefined | { name: string; isCreator: boolean }
}): SmallFollowButtonProps => {
  const { isAuthenticated } = useContext(AuthCtx)
  const featuredHandle = useMyFeaturedEntityWithCount({
    feature: 'follow',
    _key,
    entityType,
  })

  const smallFollowButtonProps: SmallFollowButtonProps = {
    followed: featuredHandle.isFeatured,
    canFollow: !info ? false : !info.isCreator,
    isCreator: !!info?.isCreator,
    isAuthenticated,
    toggleFollow: featuredHandle.toggle,
    numFollowers: featuredHandle.count,
  }
  return smallFollowButtonProps
}
