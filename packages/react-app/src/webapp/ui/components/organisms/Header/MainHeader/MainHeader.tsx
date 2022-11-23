import { LibraryAdd as LibraryAddIcon, NoteAdd as NoteAddIcon } from '@material-ui/icons'
import {
  AddonItem,
  FloatingMenu,
  Header,
  HeaderProps,
  PrimaryButton,
  Searchbox,
  TertiaryButton,
} from '@moodlenet/component-library'
import { useMemo } from 'react'
import { FC } from 'react'
import { ReactComponent as AddIcon } from '../../../../assets/icons/add-round.svg'
import defaultAvatar from '../../../../assets/img/default-avatar.svg'
import { HeaderTitle, HeaderTitleProps } from '../../../atoms/HeaderTitle/HeaderTitle.js'
import { Href, Link } from '../../../elements/link.js'
import { HeaderMenuItem } from '../addons.js'
import './MainHeader.scss'

export type AccessButtonsProps = {
  loginHref: Href
  signupHref: Href
}

export const AccessButtons: FC<AccessButtonsProps> = ({ loginHref, signupHref }) => {
  return (
    <>
      <Link href={loginHref} key="login-button">
        <PrimaryButton>
          {/* <Trans> */}
          Login
          {/* </Trans> */}
        </PrimaryButton>
      </Link>
      <Link href={signupHref} key="signup-button">
        <TertiaryButton>
          {/* <Trans> */}
          Join now
          {/* </Trans> */}
        </TertiaryButton>
      </Link>
    </>
  )
}

export type AddMenuProps = {
  newResourceHref: Href
  newCollectionHref: Href
  menuItems?: HeaderMenuItem[]
}

export const AddMenu: FC<AddMenuProps> = ({ newCollectionHref, newResourceHref, menuItems }) => {
  const addMenuItems: HeaderMenuItem[] = [
    {
      Icon: <NoteAddIcon />,
      text: /* t */ `New resource`,
      path: newResourceHref,
      key: 'new-resoure',
    },
    {
      Icon: <LibraryAddIcon />,
      text: /* t */ `New collection`,
      path: newCollectionHref,
      key: 'new-collection',
    },
  ]

  const updatedMenuItems = addMenuItems.concat(menuItems ?? [])

  return (
    <FloatingMenu
      className="add-menu"
      key="add-menu"
      menuContent={updatedMenuItems.map(menuItem => {
        // reoderedmenuItems.map((menuItem, i) => {
        return menuItem.path ? (
          <Link
            key={menuItem.key}
            className={`add-menu-item ${menuItem.className}`}
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
            className={`add-menu-item ${menuItem.className}`}
            onClick={menuItem.onClick}
          >
            <>
              {menuItem.Icon}
              {menuItem.text}
            </>
          </div>
        )
      })}
      hoverElement={<AddIcon className="add-icon" tabIndex={0} />}
    />
  )
}

export type AvatarMenuProps = {
  menuItems?: HeaderMenuItem[]
  avatarUrl?: string
  // logout: () => void
}

export const AvatarMenu: FC<AvatarMenuProps> = ({ menuItems, avatarUrl /* , logout */ }) => {
  const avatarImageUrl = avatarUrl ?? defaultAvatar

  const avatar = {
    backgroundImage: `url(${avatarImageUrl})`,
    // backgroundImage: 'url(' + defaultAvatar + ')',
    // 'url(' + (me && me.avatar ? me.avatar : defaultAvatar) + ')',
    backgroundSize: 'cover',
  }
  return (
    <FloatingMenu
      className="avatar-menu"
      key="avatar-menu"
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
  )
}

export type MainHeaderProps = {
  isAuthenticated: boolean
  leftItems?: AddonItem[]
  centerItems?: AddonItem[]
  rightItems?: AddonItem[]
  headerTitleProps: HeaderTitleProps
  addMenuProps: AddMenuProps
  avatarMenuProps: AvatarMenuProps
  accessButtonsProps: AccessButtonsProps
} & HeaderProps

export const MainHeader: FC<MainHeaderProps> = ({
  leftItems,
  centerItems,
  rightItems,
  isAuthenticated,
  headerTitleProps,
  addMenuProps,
  accessButtonsProps,
  avatarMenuProps,
  ...props
}) => {
  const { logo, smallLogo, url } = headerTitleProps

  const updatedLeftItems = useMemo(() => {
    return [
      {
        Item: () => <HeaderTitle logo={logo} smallLogo={smallLogo} url={url} />,
        key: 'header-title',
      },
      ...(leftItems ?? []),
    ].filter(Boolean)
  }, [leftItems, logo, smallLogo, url])

  const updatedCenterItems = useMemo(() => {
    return [
      {
        Item: () => <Searchbox placeholder="Search for open education content" />,
        key: 'searchbox',
      },
      ...(centerItems ?? []),
    ]
  }, [centerItems])

  const updatedRightItems: AddonItem[] = useMemo(() => {
    return [
      isAuthenticated ? { Item: () => <AddMenu {...addMenuProps} />, key: 'add-menu' } : undefined,
      isAuthenticated
        ? { Item: () => <AvatarMenu {...avatarMenuProps} />, key: 'avatar-menu' }
        : undefined,
      !isAuthenticated
        ? { Item: () => <AccessButtons {...accessButtonsProps} />, key: 'access-buttons' }
        : undefined,
      ...(rightItems ?? []),
    ].filter((item): item is AddonItem => !!item)
  }, [accessButtonsProps, addMenuProps, avatarMenuProps, isAuthenticated, rightItems])
  return (
    <Header
      leftItems={updatedLeftItems}
      centerItems={updatedCenterItems}
      rightItems={updatedRightItems}
      {...props}
    ></Header>
  )
}
