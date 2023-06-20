// import { AuthCtx } from '@moodlenet/web-user/webapp'
import { useContext } from 'react'
import type { KnownEntityType } from '../../../common/types.mjs'
import type { FollowButtonProps } from '../../ui/exports/ui.mjs'
import { useMyFeaturedEntityWithCount } from '../context/useMyFeaturedEntityWithCount.js'
import { AuthCtx } from '../exports.mjs'

export const useFollowButtonProps = ({
  _key,
  entityType,
  info,
}: {
  _key: string
  entityType: KnownEntityType
  info: null | { name: string; isCreator: boolean }
}): FollowButtonProps => {
  const { isAuthenticated } = useContext(AuthCtx)
  const featuredHandle = useMyFeaturedEntityWithCount({ feature: 'follow', _key, entityType })

  const props: FollowButtonProps = {
    followed: featuredHandle.isFeatured,
    canFollow: !info ? false : !info.isCreator,
    isCreator: !!info?.isCreator,
    isAuthenticated,
    toggleFollow: featuredHandle?.toggle ?? (() => void 0),
  }

  return props
}
