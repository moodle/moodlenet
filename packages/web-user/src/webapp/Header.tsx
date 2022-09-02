import lib from 'moodlenet-react-app-lib'
import { FC, useContext } from 'react'

export const Text = 'Profile'
export const Path = '/profile'
export const ClassName = 'profile'
export const Position = 0
export const Icon: FC = ({}) => {
  const { clientSessionData } = useContext(lib.auth.AuthCtx)
  const avatar = {
    backgroundImage: 'url(' + clientSessionData?.userDisplay.avatarUrl + ')',
    backgroundSize: 'cover',
  }

  return <div style={avatar} className="avatar" />
}
