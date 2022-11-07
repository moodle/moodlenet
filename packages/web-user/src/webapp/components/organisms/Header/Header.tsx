import { FC, ReactElement } from 'react'

export const Text = 'Profile'
export const Path = '/profile'
export const ClassName = 'profile'
export const Position = 0
type IconType = {
  icon: string | ReactElement
}
export const IconContainer: FC<IconType> = ({ icon }) => {
  // const { clientSessionData } = useContext(AuthCtx)

  // if (!clientSessionData || clientSessionData.isRoot) {
  //   return null
  // }
  // return <Icon icon={<span>xxx</span>}></Icon>
  return typeof icon === 'string' ? (
    <div
      style={{
        backgroundImage: 'url(' + icon + ')',
        // backgroundImage: 'url(' + clientSessionData.userDisplay.avatarUrl + ')',
        backgroundSize: 'cover',
      }}
      className="avatar"
      key="avatar"
    />
  ) : (
    icon
  )

  // return <Link to={`/content/${clientSessionData.myUserNode._id}`} style={avatar} className="avatar" />
}

export const Icon = (iconProps: IconType) => {
  return <IconContainer {...iconProps} />
}
