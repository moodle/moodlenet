import { FC, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthCtx } from '../../../../web-lib.mjs'
import { ProfileContainer } from './ProfileContainer.js'

export const MyProfilePageRoute: FC = () => {
  const { clientSessionData } = useContext(AuthCtx)
  if (!clientSessionData?.user) {
    return <Navigate to="/login" />
  }

  return <ProfileContainer profileKey={clientSessionData.myUserNode._key} />
}
