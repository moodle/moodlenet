import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { ProfileContainer } from './ProfileContainer.js'

export const ProfilePageRoute: FC = () => {
  const { key } = useParams()

  return <ProfileContainer profileKey={key ?? ''} />
}
