import { Trans } from '@lingui/macro'
import FavoriteIcon from '@material-ui/icons/Favorite'
import { FC } from 'react'
import './styles.scss'

export type FooterProps = {
  isAuthenticated: boolean
}

export const Footer: FC<
  FooterProps
> = (/*FIXME: unused { isAuthenticated } */) => {
  return (
    <div className={`footer`}>
      <div className="content">
        <div className="left"></div>
        <div className="center">
          <div className="extended">
            <Trans>
              We'd love to get{' '}
              <a
                href="https://feedback.moodle.org/index.php?r=survey/index&sid=766627&lang=en"
                target="_blank"
                rel="noreferrer"
              >
                your feedback on MoodleNet
              </a>{' '}
              <FavoriteIcon titleAccess="love" className="love-icon" /> You can
              suggest new features and report bugs in the{' '}
              <a
                href="https://moodle.org/mod/forum/view.php?id=8726"
                target="_blank"
                rel="noreferrer"
              >
                MoodleNet community
              </a>
              .
            </Trans>
          </div>
        </div>
        <div className="right"></div>
      </div>
    </div>
  )
}

Footer.defaultProps = {}

export default Footer
