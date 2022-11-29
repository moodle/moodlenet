import { AuthCtx } from '@moodlenet/react-app/web-lib'
import { FC, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { ProfileContainer } from './ProfileContainer.js'

export const MyProfilePageRoute: FC = () => {
  const { clientSessionData } = useContext(AuthCtx)
  if (!clientSessionData?.myUserNode) {
    return <Navigate to="/login" />
  }

  return <ProfileContainer profileKey={clientSessionData.myUserNode._key} />
}
