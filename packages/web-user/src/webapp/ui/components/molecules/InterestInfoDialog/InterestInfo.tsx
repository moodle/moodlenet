import type { Href } from '@moodlenet/component-library'
import { PrimaryButton, Snackbar, TertiaryButton } from '@moodlenet/component-library'
import { Link } from '@moodlenet/react-app/ui'
import { useState, type FC } from 'react'
import './InterestInfo.scss'

export type InterestInfoProps = {
  userSettingHref: Href
  doNotShowAgain: () => void
}

export const InterestInfo: FC<InterestInfoProps> = ({ userSettingHref, doNotShowAgain }) => {
  const [showSnackbar, setShowSnackar] = useState(false)
  const [showDialog, setShowDialog] = useState(true)
  const snackbar = (
    <Snackbar
      type="info"
      autoHideDuration={99999999}
      showCloseButton={true}
    >{`Click 'Profile menu > Settings' to set them anytime`}</Snackbar>
  )
  return (
    <>
      {showSnackbar && snackbar}
      {showDialog && (
        <div className="interest-info">
          <div className="content">
            <div className="title">Enhance your experience!</div>
            <div className="description">
              Select your interests to get the most out of MoodleNet.
              <br />
            </div>
            <div className="actions">
              <Link href={userSettingHref}>
                <PrimaryButton>Go to settings</PrimaryButton>
              </Link>
              <TertiaryButton
                onClick={() => {
                  setShowDialog(false)
                  setShowSnackar(true)
                  doNotShowAgain()
                }}
              >
                Do not show again
              </TertiaryButton>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
