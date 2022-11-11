import { ComponentType, FC, PropsWithChildren } from 'react'
import { AddonItem } from '../../../../types.js'
import './Header.scss'

export type HeaderIconType = {
  icon: ComponentType | string
  href: string
}

export type HeaderProps = {
  leftItems?: AddonItem[]
  centerItems?: AddonItem[]
  rightItems?: AddonItem[]
}

export const Header: FC<PropsWithChildren<HeaderProps>> = ({
  leftItems,
  centerItems,
  rightItems,
}) => {
  return (
    <div className="header">
      <div className="content">
        <div className="left">
          {leftItems?.map(i => (
            <i.Item key={i.key} />
          ))}
        </div>
        <div className="center">
          {centerItems?.map(i => (
            <i.Item key={i.key} />
          ))}
        </div>
        <div className="right">
          {rightItems?.map(i => (
            <i.Item key={i.key} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Header
