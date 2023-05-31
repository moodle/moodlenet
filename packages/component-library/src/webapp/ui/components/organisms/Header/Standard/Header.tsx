import type { ComponentType, FC, PropsWithChildren, ReactElement } from 'react'
import './Header.scss'

export type HeaderIconType = {
  icon: ComponentType | string
  href: string
}

export type HeaderProps = {
  leftItems?: ReactElement[]
  centerItems?: ReactElement[]
  rightItems?: ReactElement[]
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
          {leftItems}
        </div>
        <div className="center" key="center">
          {centerItems}
        </div>
        <div className="right" key="right">
          {rightItems}
        </div>
      </div>
    </div>
  )
}

export default Header
