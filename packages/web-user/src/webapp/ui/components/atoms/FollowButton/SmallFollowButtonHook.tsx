// import { AuthCtx } from '@moodlenet/web-user/webapp'
import { useContext, useMemo, useState } from 'react'
import type { KnownEntityFeature, KnownEntityType } from '../../../../../common/types.mjs'
import { AuthCtx } from '../../../../context/AuthContext.js'
import { useMyProfileContext } from '../../../../MyProfile/MyProfileContext.js'
import type { SmallFollowButtonProps } from './FollowButton.js'

const feature: KnownEntityFeature = 'follow'
export const useSmallFollowButtonProps = ({
  _key,
  entityType,
}: {
  _key: string
  entityType: KnownEntityType
}): SmallFollowButtonProps | null => {
  const { isAuthenticated } = useContext(AuthCtx)
  const [numFollowers, setNumFollowers] = useState(0)
  const feats = useMyProfileContext()?.myFeaturedEntities

  const props = useMemo<SmallFollowButtonProps | null>(() => {
    if (!feats) {
      return null
    }
    const followed = feats.isFeatured({ _key, entityType, feature })

    const toggleFollow = () => {
      const numFollowersInc = followed ? -1 : 1
      feats
        .toggle({ _key, entityType, feature })
        .then(() => setNumFollowers(num => num + numFollowersInc))
    }

    const props: SmallFollowButtonProps = {
      followed,
      canFollow: true,
      isCreator: false,
      isAuthenticated,
      toggleFollow,
      numFollowers,
    }

    return props
  }, [feats, _key, entityType, isAuthenticated, numFollowers])

  return props
}
