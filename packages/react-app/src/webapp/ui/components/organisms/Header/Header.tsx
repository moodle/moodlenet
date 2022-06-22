import { FC, PropsWithChildren } from 'react'
import Switch from '../../atoms/Switch/Switch'
import './Header.scss'

type HeaderProps = {
  devMode?: boolean
  setDevMode?: React.Dispatch<React.SetStateAction<boolean>>
}

const Header: FC<PropsWithChildren<HeaderProps>> = ({ devMode, setDevMode }) => {
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
          <div className="dev-mode">
            <span className="label">Developer mode</span>
            <Switch enabled={!!devMode} size="medium" onClick={() => setDevMode && setDevMode(p => !p)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
