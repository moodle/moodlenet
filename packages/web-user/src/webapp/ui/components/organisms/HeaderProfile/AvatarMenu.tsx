import { FloatingMenu } from '@moodlenet/component-library'
import { Href } from '@moodlenet/react-app/common'
import { Link } from '@moodlenet/react-app/ui'
import { FC, ReactNode } from 'react'
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
      key="avatar-menu"
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
