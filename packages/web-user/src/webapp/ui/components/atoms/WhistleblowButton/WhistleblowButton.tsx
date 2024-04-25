import { Snackbar, SnackbarStack, TertiaryButton } from '@moodlenet/component-library'
import { Flag } from '@mui/icons-material'
import { useState, type FC } from 'react'
import {
  WhistleblowResourceOptionType,
  WhistleblownResourceData,
} from '../../../../../common/types.mjs'
import { WhistleblowResourceModal } from '../../molecules/WhistleblowResourceModal/WhistleblowResourceModal.js'
import WhistleblownResourcesModal from '../../molecules/WhistleblownResourcesModal/WhistleblownResourcesModal.js'
import './WhistleblowButton.scss'

export type WhistleblowMoreButtonProps = {
  canWhistleblow: boolean
  whistleblowOptions: WhistleblowResourceOptionType[]
  whistleblow: () => void
}

export const WhistleblowMoreButton: FC<WhistleblowMoreButtonProps> = ({
  canWhistleblow,
  whistleblowOptions,
  whistleblow,
}) => {
  const [showWhistleblowModal, setShowWhistleblowModal] = useState(false)
  const [showWhistleblowAlert, setShowWhistleblowAlert] = useState(false)
  const whistleblowModal = showWhistleblowModal ? (
    <WhistleblowResourceModal
      setIsWhistleblowing={setShowWhistleblowModal}
      setShowWhistleblowAlert={setShowWhistleblowAlert}
      whistleblowOptions={whistleblowOptions}
      whistleblowResource={whistleblow}
    />
  ) : null

  const whistleblowAlertSnackbar = showWhistleblowAlert ? (
    <Snackbar
      type="success"
      position="bottom"
      autoHideDuration={4000}
      showCloseButton={false}
      onClose={() => setShowWhistleblowAlert(false)}
    >
      Resource reported
    </Snackbar>
  ) : null
  const snackbarstack = <SnackbarStack snackbarList={[whistleblowAlertSnackbar]} />

  return canWhistleblow ? (
    <>
      {whistleblowModal}
      {snackbarstack}
      <abbr
        key="whistleblow-more-button"
        onClick={() => setShowWhistleblowModal(true)}
        title="Report content to creator"
      >
        <Flag /> Report to creator
      </abbr>
    </>
  ) : null
}

export type WhistleblownResourcesButtonProps = {
  whistleblows: WhistleblownResourceData[]
  canSeeWhistleblow: boolean
}

export const WhistleblownResourcesButton: FC<WhistleblownResourcesButtonProps> = ({
  whistleblows,
  canSeeWhistleblow,
}) => {
  const [showWhistleblows, setShowWhistleblows] = useState(false)
  const whistleblowsModal = showWhistleblows ? (
    <WhistleblownResourcesModal
      whistleblows={whistleblows}
      setIsShowingWhistleblows={setShowWhistleblows}
    />
  ) : null

  return (
    canSeeWhistleblow &&
    whistleblows.length > 0 && (
      <>
        {whistleblowsModal}
        <TertiaryButton
          className={`whistleblow-button`}
          onClick={() => setShowWhistleblows(true)}
          abbr={`See report${whistleblows.length > 1 ? 's' : ''}`}
          key="whistleblow-button"
        >
          <Flag />
          <span>{whistleblows.length}</span>
        </TertiaryButton>
      </>
    )
  )
}

WhistleblownResourcesButton.defaultProps = {}
