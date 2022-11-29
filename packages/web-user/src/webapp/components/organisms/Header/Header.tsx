import { href } from '@moodlenet/react-app/ui'
import { AuthCtx } from '@moodlenet/react-app/web-lib'
import { FC, ReactElement, useContext } from 'react'

export const text = 'Profile'
export const path = href('/@moodlenet/web-user/my-profile')
export const className = 'profile'
export const key = 'profile'
export const position = 0
type IconType = {
  icon: string | ReactElement
}
export const IconContainer: FC = () => {
  const { clientSessionData } = useContext(AuthCtx)
  if (!clientSessionData?.myUserNode) {
    return null
  }
  const iconUrl = '' // TODO: should use avatarUrl from clientSessionData?.myUserNode
  return <Icon icon={iconUrl}></Icon>
}

export const Icon: FC<IconType> = ({ icon }: IconType) => {
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
}
