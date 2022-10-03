import {
  ExitToApp as ExitToAppIcon,
  LibraryAdd as LibraryAddIcon,
  NoteAdd as NoteAddIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons'
import { FC, PropsWithChildren, useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AuthCtx } from '../../../../../web-lib/auth.js'
// import { RegistryEntry } from '../../../../../main-lib/registry'
import { MainContext } from '../../../../../MainContext.js'
import { registries } from '../../../../../web-lib.mjs'
import { RegistryEntry } from '../../../../../web-lib/registry.js'
import { ReactComponent as AddIcon } from '../../../../assets/icons/add-round.svg'
import FloatingMenu from '../../../atoms/FloatingMenu/FloatingMenu.js'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton.js'
import TertiaryButton from '../../../atoms/TertiaryButton/TertiaryButton.js'
import { HeaderAvatarMenuItemRegItem } from '../addons.js'
import HeaderTitle from '../HeaderTitle/HeaderTitle.js'
import './Header.scss'

type HeaderProps = {}

const Header: FC<PropsWithChildren<HeaderProps>> = (/* { devMode, setDevMode } */) => {
  const { pkgId } = useContext(MainContext)

  const { registry: avatarMenuItems } = registries.avatarMenuItems.useRegistry()
  const { registry: rightComponents } = registries.rightComponents.useRegistry()

  const { clientSessionData, logout } = useContext(AuthCtx)
  const avatarImageUrl = clientSessionData?.userDisplay.avatarUrl

  const avatar = {
    backgroundImage: `url(${avatarImageUrl})`,
    // backgroundImage: 'url(' + defaultAvatar + ')',
    // 'url(' + (me && me.avatar ? me.avatar : defaultAvatar) + ')',
    backgroundSize: 'cover',
  }

  const reoderedAvatarMenuItems = useMemo(() => {
    const baseItems: RegistryEntry<HeaderAvatarMenuItemRegItem>[] = [
      { pkgId, item: { Text: 'Settings', Icon: () => <SettingsIcon />, Path: '/settings' } },
      { pkgId, item: { Text: 'Log out', Icon: () => <ExitToAppIcon />, OnClick: logout } },
    ]
    return baseItems.concat(
      avatarMenuItems.entries.sort((a, b) => (a.item.Position ?? Infinity) - (b.item.Position ?? Infinity) || 0),
    )
  }, [avatarMenuItems.entries])

  // console.log('logo ', logo)
  // console.log('smallLogo ', smallLogo)

  return (
    <div className="header">
      <div className="content">
        <div className="left">
          <HeaderTitle
          // logo={logo} smallLogo={smallLogo}
          />
        </div>
        <div className="right">
          {rightComponents.entries.flatMap(({ pkgId, item: { Component } }, index) => {
            return <Component key={`${pkgId.name}:${index}`} />
          })}

          {clientSessionData && (
            <FloatingMenu
              className="add-menu"
              menuContent={[
                <Link /* href={newResourceHref} */ to="" tabIndex={0}>
                  <NoteAddIcon />
                  {/* <Trans> */}
                  New resource
                  {/* </Trans> */}
                </Link>,
                <Link /* href={newCollectionHref} */ to="" tabIndex={0}>
                  <LibraryAddIcon />
                  {/* <Trans> */}
                  New collection
                  {/* </Trans> */}
                </Link>,
              ]}
              hoverElement={<AddIcon className="add-icon" tabIndex={0} />}
            />
          )}
          {clientSessionData ? (
            <FloatingMenu
              className="avatar-menu"
              menuContent={reoderedAvatarMenuItems.map((avatarMenuItem, i) => {
                return avatarMenuItem.item.Path ? (
                  <Link
                    key={i}
                    className={`avatar-menu-item ${avatarMenuItem.item.ClassName}`}
                    to={avatarMenuItem.item.Path}
                    onClick={avatarMenuItem.item.OnClick}
                  >
                    <>
                      <avatarMenuItem.item.Icon /> {avatarMenuItem.item.Text}
                    </>
                  </Link>
                ) : (
                  <div
                    key={i}
                    tabIndex={0}
                    className={`avatar-menu-item ${avatarMenuItem.item.ClassName}`}
                    onClick={avatarMenuItem.item.OnClick}
                  >
                    <>
                      <avatarMenuItem.item.Icon /> {avatarMenuItem.item.Text}
                    </>
                  </div>
                )
              })}
              hoverElement={<div style={avatar} className="avatar" />}
            />
          ) : (
            // <span>
            //   hello <strong>{clientSession.user.displayName}</strong>
            //   <span style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={logout}>
            //     logout
            //   </span>
            // </span>
            <>
              <Link to="/login">
                <PrimaryButton>Login</PrimaryButton>
              </Link>
              <Link to="/signup">
                <TertiaryButton>Join now</TertiaryButton>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
