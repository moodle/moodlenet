import { ComponentType, FC, PropsWithChildren, ReactElement } from 'react'
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
        <div className="left">{leftItems}</div>
        <div className="center">{centerItems}</div>
        <div className="right">{rightItems}</div>
      </div>
    </div>
  )
}

export default Header
