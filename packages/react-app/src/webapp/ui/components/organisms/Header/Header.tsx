import { FC, PropsWithChildren, useContext } from 'react'
// import Switch from '../../atoms/Switch/Switch'
import { AddonCtx } from './addons'
import './Header.scss'

type HeaderProps = {}

const Header: FC<PropsWithChildren<HeaderProps>> = (/* { devMode, setDevMode } */) => {
  const addonCtx = useContext(AddonCtx)
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
          {addonCtx.rightComponents.map(({ addon: { Comp } }, index) => {
            return <Comp key={index} />
          })}
        </div>
      </div>
    </div>
  )
}

export default Header
