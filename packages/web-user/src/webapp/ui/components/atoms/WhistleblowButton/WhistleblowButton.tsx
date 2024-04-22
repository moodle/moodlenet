import { Modal, PrimaryButton, TertiaryButton } from '@moodlenet/component-library'
import { useEffect, useState, type FC } from 'react'
import { ReactComponent as WhistleblowIcon } from '../../../assets/icons/whistleblow.svg'
import './WhistleblowButton.scss'

export type WhistleblowButtonProps = WhistleblowButtonPropsData & WhistleblowButtonPropsUI

type WhistleblowButtonPropsUI = {
  color?: 'white' | 'grey'
}

export type WhistleblowMoreButtonProps = {
  canWhistleblow: boolean
  whistleblow: () => void
}

export const WhistleblowMoreButton: FC<WhistleblowMoreButtonProps> = ({
  canWhistleblow,
  whistleblow,
}) => {
  const [showWhistleblowModal, setShowWhistleblowModal] = useState(false)
  const whistleblowModal = showWhistleblowModal ? (
    <Modal onClose={() => setShowWhistleblowModal(false)}>
      <div className="whistleblow-modal">
        <h2>Whistleblow</h2>
        <p>Whistleblow 1</p>
        <p>Whistleblow 2</p>
        <PrimaryButton onClick={whistleblow}>Whistleblow</PrimaryButton>
      </div>
    </Modal>
  ) : null

  useEffect(() => {
    if (showWhistleblowModal) {
      console.log('Whistleblow modal opened')
    }
  }, [showWhistleblowModal])

  return canWhistleblow ? (
    <>
      {whistleblowModal}
      <div key="whistleblow-more-button" onClick={() => setShowWhistleblowModal(true)}>
        <WhistleblowIcon /> Whistleblow
      </div>
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
