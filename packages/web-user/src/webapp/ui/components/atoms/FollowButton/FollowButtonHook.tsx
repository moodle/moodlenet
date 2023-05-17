// import { AuthCtx } from '@moodlenet/web-user/webapp'
import { useContext, useMemo, useState } from 'react'
import { AuthCtx } from '../../../../context/AuthContext.js'
import { shell } from '../../../../shell.mjs'
import type { FollowButtonProps } from './FollowButton.js'

export const useFollowButtonProps = ({
  profileKey,
}: {
  profileKey: string
}): FollowButtonProps | null => {
  const { isAuthenticated } = useContext(AuthCtx)
  const [followed, setFollowed] = useState(false)
  const props = useMemo(() => {
    //  if (!pageProgs) return null
    const toggleFollow = () => {
      shell.rpc.me[
        'webapp/feature-entity/:action(add|remove)/:feature(bookmark|follow|like)/:entity_id'
      ](undefined, { action: `add`, feature: 'follow', entity_id: profileKey }).then(() =>
        setFollowed(!followed),
      )
    }
    const props: FollowButtonProps = {
      followed,
      canFollow: true,
      isCreator: true,
      isAuthenticated,
      toggleFollow,
    }

    return props
  }, [followed, isAuthenticated, profileKey])

  return props
}
