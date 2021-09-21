import { FC } from 'react'
import './styles.scss'

export type FooterProps = {}

export const Footer: FC<FooterProps> = (() => {
  return (
    <div className="Footer">
      <div className="content">
        <div className="left">
        </div>
        <div className="center">
        </div>
        <div className="right">
        </div>
      </div>
    </div>
  )
})

Footer.defaultProps = {
}

export default Footer
