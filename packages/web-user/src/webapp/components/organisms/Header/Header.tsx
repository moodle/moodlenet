import { FC, ReactElement } from 'react'

export const text = 'Profile'
export const path = '/profile'
export const className = 'profile'
export const key = 'profile'
export const position = 0
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
        backgroundImage: 'url("' + icon + '")',
        // backgroundImage: 'url(' + clientSessionData.userDisplay.avatarUrl + ')',
        backgroundSize: 'cover',
      }}
      className="avatar"
    />
  ) : (
    icon
  )

  // return <Link to={`/content/${clientSessionData.myUserNode._id}`} style={avatar} className="avatar" />
}

export const Icon = (iconProps: IconType) => {
  return <IconContainer {...iconProps} />
}
