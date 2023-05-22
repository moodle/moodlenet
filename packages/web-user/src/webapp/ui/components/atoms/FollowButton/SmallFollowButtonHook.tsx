// import { AuthCtx } from '@moodlenet/web-user/webapp'
import { useContext, useMemo, useState } from 'react'
import type { KnownEntityType } from '../../../../../common/types.mjs'
import { AuthCtx } from '../../../../context/AuthContext.js'
import { useMyFeaturedEntity } from '../../../../MyProfile/MyFeaturedEntities.js'
import type { SmallFollowButtonProps } from './FollowButton.js'

export const useSmallFollowButtonProps = ({
  _key,
  entityType,
}: {
  _key: string
  entityType: KnownEntityType
}): SmallFollowButtonProps | null => {
  const { isAuthenticated } = useContext(AuthCtx)
  const [numFollowers, setNumFollowers] = useState(0)
  const { isFeatured, toggle } = useMyFeaturedEntity({ _key, entityType, feature: 'follow' })

  const props = useMemo<SmallFollowButtonProps | null>(() => {
    const followed = isFeatured

    const props: SmallFollowButtonProps = {
      followed,
      canFollow: true,
      isCreator: false,
      isAuthenticated,
      toggleFollow,
      numFollowers,
    }
    return props

    function toggleFollow() {
      const deltaNumFollowers = followed ? -1 : 1
      toggle().then(() => setNumFollowers(num => num + deltaNumFollowers))
    }
  }, [isFeatured, isAuthenticated, numFollowers, toggle])

  return props
}
