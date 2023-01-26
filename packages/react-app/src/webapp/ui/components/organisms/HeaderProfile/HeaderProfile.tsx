import { FC, ReactElement, useContext } from 'react'
import { AuthCtx } from '../../../../web-lib.mjs'
import { href } from '../../elements/link.js'
import { HeaderMenuItemRegItem } from '../Header/addons.js'

const text = 'Profile'
const path = href('/my-profile')
const className = 'profile'
const position = 0
type IconType = {
  icon: string | ReactElement
}
const IconContainer: FC = () => {
  const { clientSessionData } = useContext(AuthCtx)
  if (!clientSessionData?.user) {
    return <></>
  }
  const iconUrl = '' // TODO: should use avatarUrl from clientSessionData?.myUserNode
  return <HeaderProfileIcon icon={iconUrl}></HeaderProfileIcon>
}

export const HeaderProfileIcon: FC<IconType> = ({ icon }: IconType) => {
  return !icon ? (
    <></>
  ) : typeof icon === 'string' ? (
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

export const avatarmenuItemReg: HeaderMenuItemRegItem = {
  Icon: <IconContainer />,
  Path: path,
  Text: text,
  ClassName: className,
  Position: position,
}
