import { ComponentType, FC, PropsWithChildren, ReactNode } from 'react'
import { Link } from 'react-router-dom'
// import { AuthCtx } from '../../../../../web-lib/auth.js'
// import { RegistryEntry } from '../../../../../main-lib/registry'
// import { MainContext } from '../../../../../MainContext.js'
import { LibraryAdd as LibraryAddIcon, NoteAdd as NoteAddIcon } from '@material-ui/icons'
import { ReactComponent as AddIcon } from '../../../../assets/icons/add-round.svg'
import defaultAvatar from '../../../../assets/img/default-avatar.svg'
import FloatingMenu from '../../../atoms/FloatingMenu/FloatingMenu.js'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton.js'
import Searchbox from '../../../atoms/Searchbox/Searchbox.js'
import TertiaryButton from '../../../atoms/TertiaryButton/TertiaryButton.js'
import { HeaderAvatarMenuItemRegItem } from '../addons.js'
import HeaderTitle, { HeaderTitleProps } from '../HeaderTitle/HeaderTitle.js'
import './Header.scss'

export type HeaderIconType = {
  icon: ComponentType | string
  href: string
}

export type UserProps = {
  avatarUrl?: string
  avatarMenuItems: HeaderAvatarMenuItemRegItem[]
  logout: () => void
}

export type HeaderProps = {
  headerTitleProps: HeaderTitleProps
  leftItems?: ReactNode[]
  centerItems?: ReactNode[]
  rightItems?: ReactNode[]
  user?: UserProps
}

export const Header: FC<PropsWithChildren<HeaderProps>> = ({
  user,
  headerTitleProps,
  leftItems,
  centerItems,
  rightItems,
}) => {
  // const { registry: avatarMenuItems } = header.avatarMenuItems.useRegistry()
  // const { registry: rightComponents } = header.rightComponents.useRegistry()

  // const { clientSessionData, logout } = useContext(AuthCtx)

  const avatarImageUrl = user?.avatarUrl ?? defaultAvatar

  const avatar = {
    backgroundImage: `url(${avatarImageUrl})`,
    // backgroundImage: 'url(' + defaultAvatar + ')',
    // 'url(' + (me && me.avatar ? me.avatar : defaultAvatar) + ')',
    backgroundSize: 'cover',
  }

  const addMenu = (
    <FloatingMenu
      className="add-menu"
      key="add-menu"
      menuContent={[
        <Link /* href={newResourceHref} */ key="0" to="" tabIndex={0}>
          <NoteAddIcon />
          {/* <Trans> */}
          New resource
          {/* </Trans> */}
        </Link>,
        <Link /* href={newCollectionHref} */ key="0" to="" tabIndex={0}>
          <LibraryAddIcon />
          {/* <Trans> */}
          New collection
          {/* </Trans> */}
        </Link>,
      ]}
      hoverElement={<AddIcon className="add-icon" tabIndex={0} />}
    />
  )

  const avatarMenu = user && (
    <FloatingMenu
      className="avatar-menu"
      key="avatar-menu"
      menuContent={user.avatarMenuItems.map((avatarMenuItem, i) => {
        // reoderedAvatarMenuItems.map((avatarMenuItem, i) => {
        return avatarMenuItem.Path ? (
          <div></div>
        ) : (
          <Link
            key={i}
            className={`avatar-menu-item ${avatarMenuItem.ClassName}`}
            to={avatarMenuItem.Path ?? ''}
            //   onClick={avatarMenuItem.OnClick}
          >
            <>
              {avatarMenuItem.Icon}
              {/* {<avatarMenuItem.Icon />} */}
              {avatarMenuItem.Text}
            </>
          </Link>
          // <div></div>
          // <div
          //   key={i}
          //   tabIndex={0}
          //   className={`avatar-menu-item ${avatarMenuItem.ClassName}`}
          //   onClick={avatarMenuItem.OnClick}
          // >
          //   <>
          //     {/* <avatarMenuItem.Icon /> {avatarMenuItem.Text} */}
          //   </>
          // </div>
        )
      })}
      hoverElement={<div style={avatar} className="avatar" />}
    />
  )

  const accessButtons = (
    <>
      <Link to="/login" key="login-button">
        <PrimaryButton>Login</PrimaryButton>
      </Link>
      <Link to="/signup" key="signup-button">
        <TertiaryButton>Join now</TertiaryButton>
      </Link>
    </>
  )

  const { logo, smallLogo, url } = headerTitleProps

  const updatedLeftItems = (leftItems ?? []).concat([
    <HeaderTitle key="header-title" logo={logo} smallLogo={smallLogo} url={url} />,
  ])

  const updatedCenterItems = (centerItems ?? []).concat([
    <Searchbox key="searchbox" placeholder="Search for open education content" />,
  ])

  const updatedRightItems = (rightItems ?? []).concat([
    user && addMenu,
    user && avatarMenu,
    !user && accessButtons,
  ])

  // const profileMenuItem: HeaderAvatarMenuItemRegItem = {
  //   Text: 'Profile',
  //   Icon: <div style={avatar} className="avatar" />,
  //   Path: '',
  //   ClassName: 'profile',
  //   Position: 0,
  // }

  // const avatarMenuItems: HeaderAvatarMenuItemRegItem[] = [profileMenuItem]

  // const reoderedAvatarMenuItems = useMemo(() => {
  //   const baseItems: RegistryEntry<HeaderAvatarMenuItemRegItem>[] = [
  //     { pkg: shell.pkg, item: { Text: 'Settings', Icon: () => <SettingsIcon />, Path: '/settings' } },
  //     { pkg: shell.pkg, item: { Text: 'Log out', Icon: () => <ExitToAppIcon />, OnClick: logout } },
  //   ]
  //   return baseItems.concat(
  //     avatarMenuItems.entries.sort((a, b) => (a.item.Position ?? Infinity) - (b.item.Position ?? Infinity) || 0),
  //   )
  // }, [avatarMenuItems.entries])

  return (
    <div className="header">
      <div className="content">
        <div className="left">{updatedLeftItems}</div>
        <div className="center">{updatedCenterItems.map(Item => Item)}</div>
        <div className="right">
          {updatedRightItems.map(Item => Item)}
          {/* {rightComponents.entries.flatMap(({ pkg, item: { Component } }, index) => {
            return <Component key={`${pkg.id}:${index}`} />
          })} */}
        </div>
      </div>
    </div>
  )
}

export default Header
