import { Trans } from '@lingui/macro'
import { FC } from 'react'
import './styles.scss'

export type FooterProps = {}

export const Footer: FC<FooterProps> = () => {
  return (
    <div className="footer">
      <div className="content">
        <div className="left"></div>
        <div className="center">
          <a href="https://docs.moodle.org/dev/MoodleNet" target="_blank" rel="noreferrer">
            <Trans><span>MoodleNet</span> Beta</Trans>
          </a>
        </div>
        <div className="right"></div>
      </div>
    </div>
  )
}

Footer.defaultProps = {}

export default Footer
