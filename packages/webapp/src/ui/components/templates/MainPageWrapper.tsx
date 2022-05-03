import { t, Trans } from '@lingui/macro'
import { CSSProperties, useContext } from 'react'
import useWhatInput from 'react-use-what-input'
import Snackbar from '../../components/atoms/Snackbar/Snackbar'
import { Href, Link } from '../../elements/link'
import { withCtrl } from '../../lib/ctrl'
import { baseMoodleColor, baseStyle } from '../../styles/config'
import '../../styles/main.scss'
import StyleContext from '../../styles/Style'
import { getColorPalette } from '../../styles/utilities'
import '../../styles/view.scss'

export type MainPageWrapperProps = {
  userAcceptsPolicies: (() => unknown) | null
  cookiesPolicyHref: Href
  style?: CSSProperties | undefined
  onKeyDown?(arg0: unknown): unknown
}
export const MainPageWrapper = withCtrl<MainPageWrapperProps>(
  ({ cookiesPolicyHref, style, children, userAcceptsPolicies, onKeyDown }) => {
    const [currentInput, currentIntent] = useWhatInput()
    const styleContext = useContext(StyleContext)
    return (
      <div
        className={`main-page-wrapper current-input-${currentInput} current-intent-${currentIntent}`}
        style={{
          ...style,
          ...baseStyle(),
          ...getColorPalette(baseMoodleColor),
          ...styleContext.style,
        }}
        onKeyDown={onKeyDown}
      >
        {userAcceptsPolicies && (
          <Snackbar
            className="policies-snackbar"
            buttonText={t`Accept`}
            style={{ backgroundColor: 'black' }}
            onClose={userAcceptsPolicies}
          >
            <Trans>
              If you continue browsing this website, you agree to our<br></br>
              <a
                href="https://moodle.com/privacy-notice/"
                target="_blank"
                rel="noreferrer"
              >
                <Trans>Privacy notice</Trans>
              </a>
              and
              <Link href={cookiesPolicyHref} target="_blank" rel="noreferrer">
                <Trans>Cookies policy</Trans>
              </Link>
            </Trans>
          </Snackbar>
        )}
        <div className="env-flag" />
        {children}
      </div>
    )
  }
)
MainPageWrapper.defaultProps = {}
MainPageWrapper.displayName = 'MainPageWrapper'
