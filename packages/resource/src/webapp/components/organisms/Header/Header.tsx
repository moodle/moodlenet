import { href } from '@moodlenet/react-app/ui'
import { AuthCtx } from '@moodlenet/react-app/web-lib'
import { FC, ReactElement, useContext } from 'react'

export const text = 'Resource'
export const path = href('/@moodlenet/web-user/resource')
export const className = 'resource'
export const key = 'resource'
export const position = 0
type IconType = {
  icon: string | ReactElement
}
export const IconContainer: FC = () => {
  const { clientSessionData } = useContext(AuthCtx)
  if (!clientSessionData?.myProfile) {
    return null
  }
  const iconUrl = '' // TODO: should use avatarUrl from clientSessionData?.myProfile
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
