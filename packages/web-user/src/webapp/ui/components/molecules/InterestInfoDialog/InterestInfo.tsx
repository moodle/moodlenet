import type { Href } from '@moodlenet/component-library'
import { PrimaryButton, TertiaryButton } from '@moodlenet/component-library'
import { Link } from '@moodlenet/react-app/ui'
import type { FC } from 'react'
import './InterestInfo.scss'

export type InterestInfoProps = {
  shouldShowDialog: boolean
  userSettingHref: Href
  doNotShowAgain: () => void
}

export const InterestInfo: FC<InterestInfoProps> = ({
  shouldShowDialog,
  userSettingHref,
  doNotShowAgain,
}) => {
  return (
    shouldShowDialog && (
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
            <TertiaryButton onClick={doNotShowAgain}>Do not show again</TertiaryButton>
          </div>
        </div>
      </div>
    )
  )
}
