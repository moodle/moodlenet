import { Trans } from '@lingui/macro'
import { CP, withCtrl } from '../../../../lib/ctrl'
import {
  MainPageWrapper,
  MainPageWrapperProps,
} from '../../../templates/MainPageWrapper'
import AccessHeader, {
  AccessHeaderProps,
} from '../../Access/AccessHeader/AccessHeader'
import './styles.scss'

export type CookiesPolicyProps = {
  accessHeaderProps: CP<AccessHeaderProps, 'page'>
  mainPageWrapperProps: CP<MainPageWrapperProps>
}

export const CookiesPolicy = withCtrl<CookiesPolicyProps>(
  ({ accessHeaderProps, mainPageWrapperProps }) => {
    return (
      <MainPageWrapper {...mainPageWrapperProps}>
        {/* <MainPageWrapper onKeyDown={handleKeyDown}> */}
        <AccessHeader {...accessHeaderProps} page={'login'} />
        <div className="cookies-policy">
          <h1>
            <Trans>Cookies Policy</Trans>
          </h1>
          <p>
            <Trans>
              Our Cookies policy explains what cookies are, how we use cookies,
              how third-parties we partner with may use cookies on this site,
              and your choices regarding cookies.
            </Trans>
          </p>
          <p>
            <Trans>
              Please read the Moodle Cookie Policy in conjunction with our
              Privacy Notice which sets out additional details on how we use
              personally identifiable information and your various rights.
            </Trans>
          </p>
          <h2>
            <Trans>What are cookies?</Trans>
          </h2>
          <p>
            <Trans>
              Cookies are small pieces of text sent by your web browser by a
              website you visit. A cookie file is stored in your web browser and
              allows the site or a third-party to recognise you and make your
              next visit easier and the site more useful to you. Essentially,
              cookies are a user’s identification card for the MoodleNet
              servers. Web beacons are small graphic files linked to our servers
              that allow us to track your use of our site and related
              functionalities. Cookies and web beacons allow us to serve you
              better and more efficiently, and to personalise your experience on
              our site.
            </Trans>
          </p>
          <p>
            <Trans>Cookies can be "persistent" or "session" cookies.</Trans>
          </p>
          <h2>
            <Trans>How Moodle uses cookies</Trans>
          </h2>
          <p>
            <Trans>
              When you use and access the site, we may place a number of cookie
              files in your web browser.
            </Trans>
          </p>
          <p>
            <Trans>
              MoodleNet uses or may use cookies and/or web beacons to help us
              determine and identify repeat visitors, the type of content and
              sites to which a user of our site links, the length of time each
              user spends on any particular area of our site, and the specific
              functionalities that users choose to use. To the extent that
              cookie data constitutes personally identifiable information, we
              process such data on the basis of your consent.
            </Trans>
          </p>
          <p>
            <Trans>
              We use both session and persistent cookies on the site and we use
              different types of cookies to run the site:
            </Trans>
          </p>
          <ul>
            <li>
              <Trans>
                <i>Essential cookies</i>. Necessary for the operation of the
                site. We may use essential cookies to authenticate users,
                prevent fraudulent use of user accounts, or offer site features.
              </Trans>
            </li>
            <li>
              <Trans>
                <i>Analytical/performance cookies</i>. Allow us to recognise and
                count the number of visitors and see how visitors move around
                the site when using it. This helps us improve the way the site
                works.
              </Trans>
            </li>
            <li>
              <Trans>
                <i>Functionality cookies</i>. Used to recognise you when you
                return to the site. This enables us to personalise our content
                for you, greet you by name, and remember your preferences (for
                example, your choice of language or region).
              </Trans>
            </li>
            <li>
              <Trans>
                <i>Targeting cookies</i>. Record your visit to the site, the
                pages you have visited, and the links you have followed. We will
                use this information to make the site more relevant to your
                interests. We may also share this information with third parties
                for this purpose.
              </Trans>
            </li>
          </ul>
          <p>
            <Trans>
              To view a list of Moodle cookies, please view our{' '}
              <a href="#cookies-table">Cookies table</a>.
            </Trans>
          </p>
          <h2>
            <Trans>Third-party cookies</Trans>
          </h2>
          <p>
            <Trans>
              In addition to our own cookies, we may also use various
              third-party cookies to report usage statistics of the Site and
              refine marketing efforts.
            </Trans>
          </p>
          <ul>
            <li>
              <Trans>
                <i>Tracking cookies</i>. Follow on-site behaviour and tie it to
                other metrics allowing better understanding of usage habits.
              </Trans>
            </li>
            <li>
              <Trans>
                <i>Optimization cookies</i>. Allow real-time tracking of user
                conversion from different marketing channels to evaluate their
                effectiveness.
              </Trans>
            </li>
            <li>
              <Trans>
                <i>Partner cookies</i>. Provide marketing conversion metrics to
                our partners so they can optimize their paid marketing efforts.
              </Trans>
            </li>
          </ul>
          <h2>
            <Trans>What are your choices regarding cookies?</Trans>
          </h2>
          <p>
            <Trans>
              If you'd like to delete cookies or instruct your web browser to
              delete or refuse cookies, please visit the help pages of your web
              browser. Please note, however, that if you delete cookies or
              refuse to accept them, you might not be able to use some or all of
              the features we offer. You may not be able to log in, store your
              preferences, and some of our pages might not display properly.
            </Trans>
          </p>
          <h2 id="cookies-table">
            <Trans>Cookies table</Trans>
          </h2>
          <p>
            <Trans>
              The tables below list some of the internal and third-party cookies
              we use. As the names, numbers, and purposes of these cookies may
              change over time, this page may be updated to reflect those
              changes.
            </Trans>
          </p>
          <h2>
            <Trans>Third-party cookies</Trans>
          </h2>
          <table>
            <tbody>
              <tr>
                <th>
                  <Trans>Cookie Name</Trans>
                </th>
                <th>
                  <Trans>Default expiration time</Trans>
                </th>
                <th>
                  <Trans>Description</Trans>
                </th>
              </tr>
              <tr>
                <td>
                  <Trans>_ga</Trans>
                </td>
                <td>
                  <Trans>2 years</Trans>
                </td>
                <td>
                  <Trans>Used to distinguish users.</Trans>
                </td>
              </tr>
              <tr>
                <td>
                  <Trans>_gid</Trans>
                </td>
                <td>
                  <Trans>24 hours</Trans>
                </td>
                <td>
                  <Trans>Used to distinguish users.</Trans>
                </td>
              </tr>
              <tr>
                <td>
                  <Trans>_gat</Trans>
                </td>
                <td>
                  <Trans>1 minute</Trans>
                </td>
                <td>
                  <Trans>
                    Used to throttle request rate. If Google Analytics is
                    deployed via Google Tag Manager, this cookie will be named
                    _dc_gtm_ &lt;property- id&gt;.
                  </Trans>
                </td>
              </tr>
              <tr>
                <td>
                  <Trans>AMP_TOKEN</Trans>
                </td>
                <td>
                  <Trans>seconds to 1 year</Trans>
                </td>
                <td>
                  <Trans>
                    Contains a token that can be used to retrieve a Client ID
                    from AMP Client ID service. Other possible values indicate
                    opt-out, inflight request or an error retrieving a Client ID
                    from AMP Client ID service.
                  </Trans>
                </td>
              </tr>
              <tr>
                <td>
                  <Trans>_gac_&lt;property-id&gt;</Trans>
                </td>
                <td>
                  <Trans>90 days</Trans>
                </td>
                <td>
                  <Trans>
                    Contains campaign related information for the user. If you
                    have linked your Google Analytics and Google Ads accounts,
                    Google Ads website conversion tags will read this cookie
                    unless you opt-out. Learn more.
                  </Trans>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </MainPageWrapper>
    )
  }
)

CookiesPolicy.displayName = 'CookiesPolicyPage'
