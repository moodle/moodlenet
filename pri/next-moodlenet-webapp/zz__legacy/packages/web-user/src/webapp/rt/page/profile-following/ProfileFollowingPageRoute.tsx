import { FallbackContainer } from '@moodlenet/react-app/webapp'
import type { FC } from 'react'
import { useLocation } from 'react-router-dom'
import { matchProfileFollowingHomePageRoutePath } from '../../../../common/webapp-routes.mjs'
import { ProfileFollowingPageContainer } from './ProfileFollowingPageContainer'

export const ProfileFollowingPageRoute: FC = () => {
  const { pathname } = useLocation()
  const profileKey = matchProfileFollowingHomePageRoutePath(pathname)?.params.key
  if (!profileKey) {
    return <FallbackContainer />
  }
  return <ProfileFollowingPageContainer profileKey={profileKey} />
}
