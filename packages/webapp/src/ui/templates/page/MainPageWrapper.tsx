import { t, Trans } from '@lingui/macro'
import { FC, useState } from 'react'
import useWhatInput from 'react-use-what-input'
import Snackbar from '../../components/atoms/Snackbar/Snackbar'
import '../../styles/main.scss'
import '../../styles/view.scss'

export type MainPageWrapperProps = {
  cookiesAccepted: boolean
  onKeyDown?(arg0: unknown): unknown
}
export const MainPageWrapper: FC<MainPageWrapperProps> = ({ children, cookiesAccepted, onKeyDown }) => {
  const [currentInput, currentIntent] = useWhatInput()
  const [isShowingCookierPrompt, setIsShowingCookierPrompt] = useState<boolean>(!cookiesAccepted)

  return (
    <div
      className={`main-page-wrapper current-input-${currentInput} current-intent-${currentIntent}`}
      onKeyDown={onKeyDown}
    >
      {isShowingCookierPrompt && (
        <Snackbar className="policies-snackbar" buttonText={t`Accept`} style={{backgroundColor: 'black'}} onClose={() => setIsShowingCookierPrompt(false)}>
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
}
MainPageWrapper.defaultProps = {}
MainPageWrapper.displayName = 'MainPageWrapper'
