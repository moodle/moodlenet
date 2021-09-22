import { Trans } from '@lingui/macro'
import { FC } from 'react'
import { CP } from '../../../lib/ctrl'
import { MainPageWrapper } from '../../../templates/page/MainPageWrapper'
import AccessHeader, { AccessHeaderProps } from '../../Access/AccessHeader/AccessHeader'
import './styles.scss'

export type CookiesPolicyProps = {
  accessHeaderProps: CP<AccessHeaderProps, 'page'>
}

export const CookiesPolicy: FC<CookiesPolicyProps> = ({ accessHeaderProps }) => {
  return (
    <MainPageWrapper>
      {/* <MainPageWrapper onKeyDown={handleKeyDown}> */}
      <AccessHeader {...accessHeaderProps} page={'login'} />
      <div className="cookies-policy">
        <h1>
          <Trans>Cookies Policy</Trans>
        </h1>
        <p>
          <Trans>
            Our Cookies policy explains what cookies are, how we use cookies, how third-parties we partner with may use
            cookies on this site, and your choices regarding cookies.
          </Trans>
        </p>
        <p>
          <Trans>
            Please read the Moodle Cookie Policy in conjunction with our Privacy Notice which sets out additional
            details on how we use personally identifiable information and your various rights.
          </Trans>
        </p>
        <h2>
          <Trans>What are cookies?</Trans>
        </h2>
        <p>
          <Trans>
            Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in
            your web browser and allows the site or a third-party to recognise you and make your next visit easier and
            the site more useful to you. Essentially, cookies are a user’s identification card for the MoodleNet
            servers. Web beacons are small graphic files linked to our servers that allow us to track your use of our
            site and related functionalities. Cookies and web beacons allow us to serve you better and more efficiently,
            and to personalise your experience on our site.
          </Trans>
        </p>
        <p>
          <Trans>Cookies can be "persistent" or "session" cookies.</Trans>
        </p>
      </div>
    </MainPageWrapper>
  )
}

CookiesPolicy.displayName = 'CookiesPolicyPage'
