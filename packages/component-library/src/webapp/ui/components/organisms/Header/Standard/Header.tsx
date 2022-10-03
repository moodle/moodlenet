import { LibraryAdd as LibraryAddIcon, NoteAdd as NoteAddIcon } from '@material-ui/icons'
import { FC, PropsWithChildren, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthCtx } from '../../../../../web-lib/auth.js'
// import { RegistryEntry } from '../../../../../main-lib/registry'
import { MainContext } from '../../../../../MainContext.js'
import { ReactComponent as AddIcon } from '../../../../assets/icons/add-round.svg'
import FloatingMenu from '../../../atoms/FloatingMenu/FloatingMenu.js'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton.js'
import TertiaryButton from '../../../atoms/TertiaryButton/TertiaryButton.js'
import HeaderTitle from '../HeaderTitle/HeaderTitle.js'
import './Header.scss'

type HeaderProps = {}

const Header: FC<PropsWithChildren<HeaderProps>> = (/* { devMode, setDevMode } */) => {
  const {
    // registries: { header },
    // shell,
  } = useContext(MainContext)

  // const { registry: avatarMenuItems } = header.avatarMenuItems.useRegistry()
  // const { registry: rightComponents } = header.rightComponents.useRegistry()

  const { clientSessionData, logout } = useContext(AuthCtx)
  logout
  const avatarImageUrl = clientSessionData?.userDisplay.avatarUrl
  // const avatarImageUrl = clientSessionData?.avatarUrl ?? 'https://moodle.net/static/media/default-avatar.2ccf3558.svg'

  const avatar = {
    backgroundImage: `url(${avatarImageUrl})`,
    // backgroundImage: 'url(' + defaultAvatar + ')',
    // 'url(' + (me && me.avatar ? me.avatar : defaultAvatar) + ')',
    backgroundSize: 'cover',
  }

  // const reoderedAvatarMenuItems = useMemo(() => {
  //   const baseItems: RegistryEntry<HeaderAvatarMenuItemRegItem>[] = [
  //     { pkg: shell.pkg, item: { Text: 'Settings', Icon: () => <SettingsIcon />, Path: '/settings' } },
  //     { pkg: shell.pkg, item: { Text: 'Log out', Icon: () => <ExitToAppIcon />, OnClick: logout } },
  //   ]
  //   return baseItems.concat(
  //     avatarMenuItems.entries.sort((a, b) => (a.item.Position ?? Infinity) - (b.item.Position ?? Infinity) || 0),
  //   )
  // }, [avatarMenuItems.entries])
  // const avatarMenuItems = baseAvatarMenuItems

  const orderedAvatarMenuItems: AvatarMenuItem[] = []
  const unorderedAvatarMenuItems: AvatarMenuItem[] = []
  headerCtx.avatarMenuItems.map(menuItem => {
    typeof menuItem.def.Position === 'number'
      ? orderedAvatarMenuItems.push(menuItem)
      : unorderedAvatarMenuItems.push(menuItem)
  })

  const avatarMenuItems = useMemo(() => {
    const menuItems = baseAvatarMenuItems.concat(unorderedAvatarMenuItems)

    orderedAvatarMenuItems
      .sort((a, b) => (a.def.Position && b.def.Position ? a.def.Position - b.def.Position : 0))
      .map(menuItem => {
        return typeof menuItem.def.Position === 'number' && menuItems.splice(menuItem.def.Position, 0, menuItem)
      })
    return menuItems
  }, [headerCtx.avatarMenuItems])

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
          {/* {rightComponents.entries.flatMap(({ pkg, item: { Component } }, index) => {
            return <Component key={`${pkg.id}:${index}`} />
          })} */}

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
              menuContent={
                [] /* reoderedAvatarMenuItems.map((avatarMenuItem, i) => {
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
              }) */
              }
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
