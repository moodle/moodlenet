import type { ComponentType, FC, PropsWithChildren } from 'react'
import type { AddonItem } from '../../../../types.js'
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
        <div className="left" key="left">
          {leftItems?.map(i => (
            <i.Item key={i.key} />
          ))}
        </div>
        <div className="center" key="center">
          {centerItems?.map(i => (
            <i.Item key={i.key} />
          ))}
        </div>
        <div className="right" key="right">
          {rightItems?.map(i => (
            <i.Item key={i.key} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Header
