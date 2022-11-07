import { LibraryAdd as LibraryAddIcon, NoteAdd as NoteAddIcon } from '@material-ui/icons'
import {
  AddonItem,
  FloatingMenu,
  Header,
  PrimaryButton,
  Searchbox,
  sortAddonItems,
  TertiaryButton,
} from '@moodlenet/component-library'
import { FC } from 'react'
import { ReactComponent as AddIcon } from '../../../../assets/icons/add-round.svg'
import defaultAvatar from '../../../../assets/img/default-avatar.svg'
import { Href, Link } from '../../../../elements/link.js'
import { HeaderTitle, HeaderTitleProps } from '../../../atoms/HeaderTitle/HeaderTitle.js'
import { HeaderMenuItem } from '../addons.js'

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

export const AddMenu: FC<AddMenuProps> = ({
  newCollectionHref,
  newResourceHref /* , menuItems */,
}) => {
  return (
    <FloatingMenu
      className="add-menu"
      key="add-menu"
      menuContent={[
        <Link key="0" href={newResourceHref} tabIndex={0}>
          <NoteAddIcon />
          {/* <Trans> */}
          New resource
          {/* </Trans> */}
        </Link>,
        <Link key="0" href={newCollectionHref} tabIndex={0}>
          <LibraryAddIcon />
          {/* <Trans> */}
          New collection
          {/* </Trans> */}
        </Link>,
      ]}
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
      menuContent={(menuItems ?? []).map((menuItem, i) => {
        // reoderedmenuItems.map((menuItem, i) => {
        return menuItem.Path ? (
          <Link
            key={i}
            className={`avatar-menu-item ${menuItem.ClassName}`}
            href={menuItem.Path}
            //   onClick={menuItem.OnClick}
          >
            <>
              {menuItem.Icon}
              {menuItem.Text}
            </>
          </Link>
        ) : (
          <div
            key={i}
            className={`avatar-menu-item ${menuItem.ClassName}`}
            //   onClick={menuItem.OnClick}
          >
            <>
              {menuItem.Icon}
              {menuItem.Text}
            </>
          </div>
          // <div></div>
          // <div
          //   key={i}
          //   tabIndex={0}
          //   className={`avatar-menu-item ${menuItem.ClassName}`}
          //   onClick={menuItem.OnClick}
          // >
          //   <>
          //     {/* <menuItem.Icon /> {menuItem.Text} */}
          //   </>
          // </div>
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
}

export const MainHeader: FC<MainHeaderProps> = ({
  leftItems,
  centerItems,
  rightItems,
  isAuthenticated,
  headerTitleProps,
  addMenuProps,
  accessButtonsProps,
  avatarMenuProps,
}) => {
  const { logo, smallLogo, url } = headerTitleProps

  const updatedLeftItems = sortAddonItems([
    <HeaderTitle key="header-title" logo={logo} smallLogo={smallLogo} url={url} />,
    ...(leftItems ?? []),
  ])

  const updatedCenterItems = sortAddonItems([
    <Searchbox key="searchbox" placeholder="Search for open education content" />,
    ...(centerItems ?? []),
  ])

  const updatedRightItems = sortAddonItems([
    isAuthenticated && <AddMenu {...addMenuProps} />,
    isAuthenticated && <AvatarMenu {...avatarMenuProps} />,
    !isAuthenticated && <AccessButtons {...accessButtonsProps} />,
    ...(rightItems ?? []),
  ])
  return (
    <Header
      leftItems={updatedLeftItems}
      centerItems={updatedCenterItems}
      rightItems={updatedRightItems}
    ></Header>
  )
}
