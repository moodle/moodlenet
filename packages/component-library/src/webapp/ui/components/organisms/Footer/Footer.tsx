import { FC, PropsWithChildren } from 'react'
import { AddonItem } from '../../../types.js'
import './Footer.scss'

export type FooterProps = {
  leftItems?: AddonItem[]
  centerItems?: AddonItem[]
  rightItems?: AddonItem[]
}

export const Footer: FC<PropsWithChildren<FooterProps>> = ({
  leftItems,
  centerItems,
  rightItems,
}) => {
  return (
    <div className="footer">
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

export default Footer
