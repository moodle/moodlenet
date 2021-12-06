import React, { FC } from 'react'
import Card from '../Card/Card'
import './styles.scss'

export type FloatingMenuProps = {
  menuContent: React.ReactNode
  hoverElement: React.ReactNode
  visible?: boolean
}

export const FloatingMenu: FC<FloatingMenuProps> = ({
  visible,
  menuContent,
  hoverElement,
}) => {
  return (
    <div className="floating-menu">
      {hoverElement}
      <div className={`menu ${visible ? 'visible' : ''}`}>
        <Card className="content">{menuContent}</Card>
      </div>
    </div>
  )
}

FloatingMenu.defaultProps = {
  visible: false,
}

export default FloatingMenu
