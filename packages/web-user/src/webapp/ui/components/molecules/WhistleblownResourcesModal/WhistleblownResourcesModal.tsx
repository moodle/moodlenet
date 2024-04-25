import { Modal } from '@moodlenet/component-library'
import { Link } from '@moodlenet/react-app/ui'
import { type FC, type SetStateAction } from 'react'
import { WhistleblownResourceData } from '../../../../../common/types.mjs'
import './WhistleblownResourcesModal.scss'

export type WhistleblownResourcesModalProps = {
  whistleblows: WhistleblownResourceData[]
  setIsShowingWhistleblows: (value: SetStateAction<boolean>) => void
}

export const WhistleblownResourcesModal: FC<WhistleblownResourcesModalProps> = ({
  whistleblows,
  setIsShowingWhistleblows,
}) => {
  return (
    <Modal
      className={'whistleblown-resources-modal'}
      title="User reports"
      onClose={() => setIsShowingWhistleblows(false)}
      style={{ maxWidth: '600px' }}
    >
      {whistleblows.map((whistleblow, i) => {
        const { user, type, comment, date } = whistleblow
        const { displayName, avatarUrl, profileHref } = user
        return (
          <div className="whistleblow" key={i}>
            <div className="whistleblow-header">
              <Link className="avatar-container" href={profileHref}>
                <img className="whistleblow-avatar" src={avatarUrl} />
              </Link>
              <div className="whistleblow-header-center">
                <div className="display-name-and-reason">
                  <abbr className="display-name" title="Go to profile page">
                    <Link href={profileHref}>{displayName}</Link>
                  </abbr>
                  reported for <b>{type.name.toLowerCase()}</b>
                </div>
                <div className="whistleblow-date">
                  {date.toLocaleString('default', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </div>
              </div>
            </div>
            {comment && comment !== '' && (
              <div className="whistleblow-comment">
                <div className="dialog-corner" />
                {comment}
              </div>
            )}
          </div>
        )
      })}
    </Modal>
  )
}

WhistleblownResourcesModal.defaultProps = {}

export default WhistleblownResourcesModal
