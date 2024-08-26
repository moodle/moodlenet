import { FallbackContainer } from '@moodlenet/react-app/webapp'
import type { FC } from 'react'
import { useLocation } from 'react-router-dom'
import { matchProfileFollowersHomePageRoutePath } from '../../../../common/webapp-routes.mjs'
import { ProfileFollowersPageContainer } from './ProfileFollowersPageContainer.js'

export const ProfileFollowersPageRoute: FC = () => {
  const { pathname } = useLocation()
  const profileKey = matchProfileFollowersHomePageRoutePath(pathname)?.params.key
  if (!profileKey) {
    return <FallbackContainer />
  }
  return <ProfileFollowersPageContainer profileKey={profileKey} />
}
