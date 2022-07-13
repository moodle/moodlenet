import { FC, PropsWithChildren, useContext } from 'react'
import { Link } from 'react-router-dom'
// import Switch from '../../atoms/Switch/Switch'
import { AddonCtx } from '../addons'
import './MinimalisticHeader.scss'

type MinimalisticHeaderProps = {}

const MinimalisticHeader: FC<PropsWithChildren<MinimalisticHeaderProps>> = (/* { devMode, setDevMode } */) => {
  const addonCtx = useContext(AddonCtx)
  return (
    <div className="minimalistic-header">
      <div className="content">
        <div className="left">
          <Link className="title" to={`/`}>
            <span className="mn">MoodleNet</span>
            <span className="bar">|</span>
          </Link>
        </div>
        <div className="right">
          {addonCtx.rightComponents.flatMap(({ addon: { MinHeaderItems } }, index) => {
            return (MinHeaderItems ?? []).map((Item, subIndex) => <Item key={`${index}:${subIndex}`} />)
          })}
        </div>
      </div>
    </div>
  )
}

export default MinimalisticHeader
