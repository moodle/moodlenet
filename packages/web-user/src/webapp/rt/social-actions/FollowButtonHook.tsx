// import { AuthCtx } from '@moodlenet/web-user/webapp'
import { useContext, useMemo } from 'react'
import type { KnownEntityType } from '../../../common/types.mjs'
import type { FollowButtonProps } from '../../ui/exports/ui.mjs'
import { useMyFeaturedEntity } from '../context/useMyFeaturedEntity.js'
import { AuthCtx } from '../exports.mjs'

export const useFollowButtonProps = ({
  _key,
  entityType,
}: {
  _key: string
  entityType: KnownEntityType
}): FollowButtonProps | null => {
  const { isAuthenticated } = useContext(AuthCtx)
  const { isFeatured, toggle: toggleFollow } = useMyFeaturedEntity({
    _key,
    entityType,
    feature: 'follow',
  })

  const props = useMemo<FollowButtonProps | null>(() => {
    const props: FollowButtonProps = {
      followed: isFeatured,
      canFollow: true,
      isCreator: false,
      isAuthenticated,
      toggleFollow,
    }
    return props
  }, [isFeatured, isAuthenticated, toggleFollow])

  return props
}
