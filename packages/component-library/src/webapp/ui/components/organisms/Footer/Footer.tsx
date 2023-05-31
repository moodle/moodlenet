import type { FC, PropsWithChildren, ReactElement } from 'react'
import './Footer.scss'

export type FooterProps = {
  leftItems?: ReactElement[]
  centerItems?: ReactElement[]
  rightItems?: ReactElement[]
}

export const Footer: FC<PropsWithChildren<FooterProps>> = ({
  leftItems,
  centerItems,
  rightItems,
}) => {
  return (
    <div className="footer">
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

export default Footer
