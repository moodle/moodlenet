import { Trans } from '@lingui/macro'
import { FC } from 'react'
import './styles.scss'

export type FooterProps = {
  isAuthenticated: boolean
}

export const Footer: FC<FooterProps> = (/*FIXME: unused { isAuthenticated } */) => {
  return (
    <div className={`footer`}>
      <div className="content">
        <div className="left"></div>
        <div className="center">
            <div className="extended">
              <Trans>
                Should you encounter any bugs, glitches, lack of functionality
                or other problems, please post in the{' '}
                <a
                  href="https://moodle.org/mod/forum/view.php?id=8726"
                  target="_blank"
                  rel="noreferrer"
                >
                  MoodleNet community
                </a>{' '}
                or create an issue at{' '}
                <a
                  href="https://tracker.moodle.org/secure/RapidBoard.jspa?projectKey=MDLNET&rapidView=167"
                  target="_blank"
                  rel="noreferrer"
                >
                  MoodleNet Tracker
                </a>
                .
              </Trans>
            </div>
          )
        </div>
        <div className="right"></div>
      </div>
    </div>
  )
}

Footer.defaultProps = {}

export default Footer
