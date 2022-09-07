import lib from 'moodlenet-react-app-lib'
import { FC, useContext } from 'react'
import { Link } from 'react-router-dom'

const {} = lib
export const Text = 'Profile'
// export const Path = '/profile'
export const ClassName = 'profile'
export const Position = 0
export const Icon: FC = ({}) => {
  const { clientSessionData } = useContext(lib.auth.AuthCtx)
  if (!clientSessionData || clientSessionData.isRoot) {
    return null
  }
  const avatar = {
    backgroundImage: 'url(' + clientSessionData.userDisplay.avatarUrl + ')',
    backgroundSize: 'cover',
  }

  return <Link to={`/content/${clientSessionData.myUserNode._id}`} style={avatar} className="avatar" />
}