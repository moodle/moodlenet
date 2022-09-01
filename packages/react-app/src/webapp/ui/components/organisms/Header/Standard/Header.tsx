import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import LibraryAddIcon from '@material-ui/icons/LibraryAdd'
import NoteAddIcon from '@material-ui/icons/NoteAdd'
import SettingsIcon from '@material-ui/icons/Settings'
import { FC, PropsWithChildren, useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AuthCtx } from '../../../../../../react-app-lib/auth'
import { ReactComponent as AddIcon } from '../../../../assets/icons/add-round.svg'
import { PrimaryButton, TertiaryButton } from '../../../atoms'
import FloatingMenu from '../../../atoms/FloatingMenu/FloatingMenu'
import { AddonCtx, AvatarMenuItem } from '../addons'
import HeaderTitle from '../HeaderTitle/HeaderTitle'
import './Header.scss'

type HeaderProps = {}

const Header: FC<PropsWithChildren<HeaderProps>> = (/* { devMode, setDevMode } */) => {
  const addonCtx = useContext(AddonCtx)
  // const setCtx = useContext(SettingsCtx)
  const headerCtx = useContext(AddonCtx)

  const { clientSessionData, logout } = useContext(AuthCtx)

  const baseAvatarMenuItems: AvatarMenuItem[] = [
    { def: { Text: 'Settings', Icon: () => <SettingsIcon />, Path: '/settings' } },
    { def: { Text: 'Log out', Icon: () => <ExitToAppIcon />, OnClick: logout } },
  ]

  const avatarImageUrl = clientSessionData?.avatarUrl ?? 'https://moodle.net/static/media/default-avatar.2ccf3558.svg'

  const avatar = {
    backgroundImage: `url(${avatarImageUrl})`,
    // backgroundImage: 'url(' + defaultAvatar + ')',
    // 'url(' + (me && me.avatar ? me.avatar : defaultAvatar) + ')',
    backgroundSize: 'cover',
  }

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

    orderedAvatarMenuItems.map(menuItem => {
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
          {addonCtx.rightComponents.flatMap(({ addon: { StdHeaderItems } }, index) => {
            return (StdHeaderItems ?? []).map((Item, subIndex) => <Item key={`${index}:${subIndex}`} />)
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
              menuContent={avatarMenuItems.map((avatarMenuItem, i) => {
                return avatarMenuItem.def.Path ? (
                  <Link
                    key={i}
                    className={`avatar-menu-item ${avatarMenuItem.def.ClassName}`}
                    to={avatarMenuItem.def.Path}
                    onClick={avatarMenuItem.def.OnClick}
                  >
                    <>
                      <avatarMenuItem.def.Icon /> {avatarMenuItem.def.Text}
                    </>
                  </Link>
                ) : (
                  <div
                    key={i}
                    tabIndex={0}
                    className={`avatar-menu-item ${avatarMenuItem.def.ClassName}`}
                    onClick={avatarMenuItem.def.OnClick}
                  >
                    <>
                      <avatarMenuItem.def.Icon /> {avatarMenuItem.def.Text}
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
