import { FloatingMenu } from '@moodlenet/component-library'
import { Href, href } from '@moodlenet/react-app/common'
import { HeaderMenuItemRegItem, Link } from '@moodlenet/react-app/ui'
import { ExitToApp } from '@mui/icons-material'
import { FC, ReactElement, ReactNode, useContext } from 'react'
import { AuthCtx } from '../../../../context/AuthContext.js'
import defaultAvatar from '../../../assets/img/default-avatar.svg'

export type AvatarMenuItemRegItem = Omit<AvatarMenuItem, 'key'>
export type AvatarMenuItem = {
  Icon: ReactNode
  text: string
  key: string | number
  path?: Href
  className?: string
  position?: number
  onClick?: () => unknown
}
export type AvatarMenuProps = {
  menuItems: AvatarMenuItem[]
  avatarUrl: string | undefined
}

export const AvatarMenu: FC<AvatarMenuProps> = ({ menuItems, avatarUrl }) => {
  const avatarImageUrl = avatarUrl ?? defaultAvatar

  const avatar = {
    backgroundImage: `url(${avatarImageUrl})`,
    // backgroundImage: 'url(' + defaultAvatar + ')',
    // 'url(' + (me && me.avatar ? me.avatar : defaultAvatar) + ')',
    backgroundSize: 'cover',
  }

  return menuItems.length > 0 ? (
    <FloatingMenu
      className="avatar-menu"
      key="avatar-menurt"
      abbr="User menu"
      menuContent={(menuItems ?? []).map(menuItem => {
        // reoderedmenuItems.map((menuItem, i) => {
        return menuItem.path ? (
          <Link
            key={menuItem.key}
            className={`avatar-menu-item ${menuItem.className}`}
            href={menuItem.path}
          >
            <>
              {menuItem.Icon}
              {menuItem.text}
            </>
          </Link>
        ) : (
          <div
            key={menuItem.key}
            className={`avatar-menu-item ${menuItem.className}`}
            onClick={menuItem.onClick}
          >
            <>
              {menuItem.Icon}
              {menuItem.text}
            </>
          </div>
        )
      })}
      hoverElement={<div style={avatar} className="avatar" />}
    />
  ) : null
}

type IconType = {
  icon: string | ReactElement
}
const IconContainer: FC = () => {
  const { clientSessionData } = useContext(AuthCtx)
  if (!clientSessionData?.myProfile) {
    return <></>
  }
  const iconUrl = '' // TODO //@ETTO: should use avatarUrl from clientSessionData?.myProfile
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

export const profileAvatarmenuItemReg: HeaderMenuItemRegItem = {
  Icon: <IconContainer />,
  Path: href('/my-profile'),
  Text: 'Profile',
  ClassName: 'profile',
  // Position: position,
}

export const signoutAvatarmenuItemReg: HeaderMenuItemRegItem = {
  Icon: <ExitToApp />,
  Path: href('/signout'),
  Text: 'Sign out',
  ClassName: 'signout',
  // Position: position,
}
