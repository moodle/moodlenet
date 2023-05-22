import type { FC } from 'react'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthCtx } from '../../context/AuthContext.js'
import { ProfileContainer } from './ProfileContainer.js'

export const MyProfilePageRoute: FC = () => {
  const { clientSessionData } = useContext(AuthCtx)
  if (!clientSessionData?.myProfile) {
    return <Navigate to="/login" />
  }

  return <ProfileContainer profileKey={clientSessionData.myProfile._key} />
}
