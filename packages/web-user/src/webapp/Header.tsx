import { FC, useContext } from 'react'
import { Link } from 'react-router-dom'
import { MainContext } from './MainModule'

export const Text = 'Profile'
// export const Path = '/profile'
export const ClassName = 'profile'
export const Position = 0
export const Icon: FC = ({}) => {
  const { shell } = useContext(MainContext)
  const [, reactApp] = shell.deps
  const { clientSessionData } = useContext(reactApp.AuthCtx)

  if (!clientSessionData || clientSessionData.isRoot) {
    return null
  }
  const avatar = {
    backgroundImage: 'url(' + clientSessionData.userDisplay.avatarUrl + ')',
    backgroundSize: 'cover',
  }

  return <Link to={`/content/${clientSessionData.myUserNode._id}`} style={avatar} className="avatar" />
}
