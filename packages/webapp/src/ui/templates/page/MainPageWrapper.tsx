import { t, Trans } from '@lingui/macro'
import { useCallback, useState } from 'react'
import useWhatInput from 'react-use-what-input'
import Snackbar from '../../components/atoms/Snackbar/Snackbar'
import { withCtrl } from '../../lib/ctrl'
import '../../styles/main.scss'
import '../../styles/view.scss'

export type MainPageWrapperProps = {
  userAcceptsPolicies: (() => unknown) | null
  onKeyDown?(arg0: unknown): unknown
}
export const MainPageWrapper = withCtrl<MainPageWrapperProps>(({ children, userAcceptsPolicies, onKeyDown }) => {
  const [currentInput, currentIntent] = useWhatInput()
  const [isShowingPoliciesPrompt, setIsShowingPoliciesPrompt] = useState<boolean>(!!userAcceptsPolicies)
  const userAcceptsPoliciesCb = useCallback(() => {
    setIsShowingPoliciesPrompt(false)
    userAcceptsPolicies && userAcceptsPolicies()
  }, [userAcceptsPolicies])

  return (
    <div
      className={`main-page-wrapper current-input-${currentInput} current-intent-${currentIntent}`}
      onKeyDown={onKeyDown}
    >
      {isShowingPoliciesPrompt && (
        <Snackbar
          className="policies-snackbar"
          buttonText={t`Accept`}
          style={{ backgroundColor: 'black' }}
          onClose={userAcceptsPoliciesCb}
        >
          <Trans>
            If you continue browsing this website, you agree to our
            <a href="https://moodle.com/privacy-notice/" target="_blank" rel="noreferrer">
              Privacy notice
            </a>
            and
            <a href="https://moodle.com/cookies-policy/" target="_blank" rel="noreferrer">
              Cookies policy
            </a>
          </Trans>
        </Snackbar>
      )}
      {children}
    </div>
  )
})
MainPageWrapper.defaultProps = {}
MainPageWrapper.displayName = 'MainPageWrapper'
