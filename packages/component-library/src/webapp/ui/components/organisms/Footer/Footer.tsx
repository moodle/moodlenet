import type { FC, PropsWithChildren, ReactElement } from 'react'
import PoweredByMoodleNet from '../../../assets/logos/powered-by-moodlenet.svg'
import './Footer.scss'

export type FooterProps = {
  leftItems?: ReactElement[]
  centerItems?: ReactElement[]
  rightItems?: ReactElement[]
  items?: ReactElement[]
  showCopyright?: boolean
}

export const Footer: FC<PropsWithChildren<FooterProps>> = ({
  leftItems,
  centerItems,
  rightItems,
  showCopyright,
}) => {
  return (
    <div className="footer">
      <div className="top">
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
      <div className="bottom">
        <div className="bottom">
          {showCopyright && <img className="logo big" src={PoweredByMoodleNet} alt="Logo" />}
        </div>
      </div>
    </div>
  )
}

export default Footer
