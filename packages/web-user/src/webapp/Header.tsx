import { FC } from 'react'
import { Link } from 'react-router-dom'
import { HeaderIconType } from '../../../component-library/lib/ui.mjs'

export const Text = 'Profile'
// export const Path = '/profile'
export const ClassName = 'profile'
export const Position = 0
export const Icon: FC<HeaderIconType> = ({ href, icon }) => {
  // const { clientSessionData } = useContext(AuthCtx)

  // if (!clientSessionData || clientSessionData.isRoot) {
  //   return null
  // }
  const avatar =
    typeof icon === 'string'
      ? {
          backgroundImage: 'url(' + icon + ')',
          // backgroundImage: 'url(' + clientSessionData.userDisplay.avatarUrl + ')',
          backgroundSize: 'cover',
        }
      : {}

  return <Link to={href} style={avatar} className="avatar" />

  // return <Link to={`/content/${clientSessionData.myUserNode._id}`} style={avatar} className="avatar" />
}
