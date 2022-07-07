import { FC, PropsWithChildren, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthCtx } from '../../../../../../react-app-lib/auth'
// import Switch from '../../atoms/Switch/Switch'
import { AddonCtx } from '../addons'
import './Header.scss'

type HeaderProps = {}

const Header: FC<PropsWithChildren<HeaderProps>> = (/* { devMode, setDevMode } */) => {
  const addonCtx = useContext(AddonCtx)
  const { clientSession, logout } = useContext(AuthCtx)
  return (
    <div className="header">
      <div className="content">
        <div className="left">
          <div className="title">
            <span className="mn">MoodleNet</span>
            <span className="bar">|</span>
          </div>
        </div>
        <div className="right">
          {addonCtx.rightComponents.flatMap(({ addon: { StdHeaderItems } }, index) => {
            return (StdHeaderItems ?? []).map((Item, subIndex) => <Item key={`${index}:${subIndex}`} />)
          })}

          {clientSession ? (
            <span>
              hello <strong>{clientSession.user.displayName}</strong>
              <span style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={logout}>
                logout
              </span>
            </span>
          ) : (
            <Link to="/login">login</Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
