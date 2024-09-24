import type { FC } from 'react'
import { useLocation } from 'react-router-dom'
import { matchProfileHomePageRoutePath } from '../../../../common/webapp-routes.mjs'
import { ProfileContainer } from './ProfileContainer'

export const ProfilePageRoute: FC = () => {
  const { pathname } = useLocation()

  const key = matchProfileHomePageRoutePath(pathname)?.params.key
  // console.log({ key })
  if (!key) return null
  return <ProfileContainer profileKey={key} key={key} />
}
