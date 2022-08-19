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
              Find how to report bugs and propose new features in{' '}
              <a
                href="https://moodle.org/mod/forum/view.php?id=8726"
                target="_blank"
                rel="noreferrer"
              >
                our community
              </a>
              . We would love to get{' '}
              <a
                href="https://feedback.moodle.org/index.php?r=survey/index&sid=766627&lang=en"
                target="_blank"
                rel="noreferrer"
              >
                your feedback
              </a>
              ! <FavoriteIcon titleAccess="love" className="love-icon" />
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
