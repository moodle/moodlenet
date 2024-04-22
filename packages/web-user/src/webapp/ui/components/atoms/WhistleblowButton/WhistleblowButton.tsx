import { Modal, Snackbar, TertiaryButton } from '@moodlenet/component-library'
import { useState, type FC } from 'react'
import { ReactComponent as WhistleblowIcon } from '../../../assets/icons/whistleblow.svg'
import WhistleblowResource from '../../molecules/WhistleblowResource/WhistleblowResource.js'
import { WhistleblowOptionType } from '../../molecules/WhistleblowResource/WhistleblowResourceData.js'
import './WhistleblowButton.scss'

export type WhistleblowButtonProps = WhistleblowButtonPropsData & WhistleblowButtonPropsUI

type WhistleblowButtonPropsUI = {
  color?: 'white' | 'grey'
}

export type WhistleblowMoreButtonProps = {
  canWhistleblow: boolean
  whistleblowOptions: WhistleblowOptionType[]
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
    <WhistleblowResource
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
      Profile reported
    </Snackbar>
  ) : null

  return canWhistleblow ? (
    <>
      {whistleblowModal}
      {whistleblowAlertSnackbar}
      <abbr
        key="whistleblow-more-button"
        onClick={() => setShowWhistleblowModal(true)}
        title="Report content to creator"
      >
        <WhistleblowIcon /> Whistleblow
      </abbr>
    </>
  ) : null
}

export type WhistleblowButtonPropsData = {
  numWhistleblows: number
  canSeeWhistleblow: boolean
}

export const WhistleblowButton: FC<WhistleblowButtonProps> = ({
  numWhistleblows,
  canSeeWhistleblow,
  color,
}) => {
  const [showWhistleblows, setShowWhistleblows] = useState(false)
  const whistleblowsModal = showWhistleblows ? (
    <Modal onClose={() => setShowWhistleblows(false)}>
      <div className="whistleblows-modal">
        <h2>Whistleblows</h2>
        <ul>
          <li>Whistleblow 1</li>
          <li>Whistleblow 2</li>
        </ul>
      </div>
    </Modal>
  ) : null

  return (
    canSeeWhistleblow &&
    numWhistleblows > 0 && (
      <>
        {whistleblowsModal}
        <TertiaryButton
          className={`whistleblow-button ${color}`}
          onClick={() => setShowWhistleblows(true)}
          abbr={`See whistleblow${numWhistleblows > 1 ? 's' : ''}`}
          key="whistleblow-button"
        >
          <WhistleblowIcon />
          <span>{numWhistleblows}</span>
        </TertiaryButton>
      </>
    )
  )
}

WhistleblowButton.defaultProps = {
  color: 'grey',
}
