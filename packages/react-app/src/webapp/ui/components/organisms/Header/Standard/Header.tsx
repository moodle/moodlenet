import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import SettingsIcon from '@material-ui/icons/Settings'
import { FC, PropsWithChildren, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthCtx } from '../../../../../../react-app-lib/auth'
import { PrimaryButton, TertiaryButton } from '../../../atoms'
import FloatingMenu from '../../../atoms/FloatingMenu/FloatingMenu'
import { SettingsCtx } from '../../../pages/Settings/SettingsContext'
// import Switch from '../../atoms/Switch/Switch'
import { AddonCtx } from '../addons'
import './Header.scss'

type HeaderProps = {}

const Header: FC<PropsWithChildren<HeaderProps>> = (/* { devMode, setDevMode } */) => {
  const addonCtx = useContext(AddonCtx)
  const setCtx = useContext(SettingsCtx)
  // console.log({ addonCtx })

  const { clientSessionData, logout } = useContext(AuthCtx)

  const avatarImageUrl = clientSessionData?.avatarUrl ?? 'https://moodle.net/static/media/default-avatar.2ccf3558.svg'

  const avatar = {
    backgroundImage: `url(${avatarImageUrl})`,
    // backgroundImage: 'url(' + defaultAvatar + ')',
    // 'url(' + (me && me.avatar ? me.avatar : defaultAvatar) + ')',
    backgroundSize: 'cover',
  }

  const avatarMenuItems = [
    <Link to="/settings">
      <SettingsIcon />
      Settings
    </Link>,
    <Link to="/" onClick={logout}>
      <ExitToAppIcon />
      Log out
    </Link>,
  ]

  return (
    <div className="header">
      <div className="content">
        <div className="left">
          <Link className="title" to={`/`}>
            <span className="mn">{setCtx.organizationData.instanceName}</span>
            <span className="bar">|</span>
          </Link>
        </div>
        <div className="right">
          {addonCtx.rightComponents.flatMap(({ addon: { StdHeaderItems } }, index) => {
            return (StdHeaderItems ?? []).map((Item, subIndex) => <Item key={`${index}:${subIndex}`} />)
          })}

          {clientSessionData ? (
            <FloatingMenu
              className="avatar-menu"
              menuContent={avatarMenuItems}
              hoverElement={
                <div style={avatar} className="avatar" {...{ referrerPolicy: 'no-referrer' }} />
                // <Link
                //   href={me.myProfileHref}
                //   style={avatar}
                //   className="avatar"
                // />
              }
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
