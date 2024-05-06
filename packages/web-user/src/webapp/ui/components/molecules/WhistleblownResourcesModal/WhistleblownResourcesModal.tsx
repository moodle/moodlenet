import { Modal } from '@moodlenet/component-library'
import { getTimeAgo } from '@moodlenet/component-library/common'
import { Link } from '@moodlenet/react-app/ui'
import { type FC, type SetStateAction } from 'react'
import type { WhistleblownResourceData } from '../../../../../common/types.mjs'
import './WhistleblownResourcesModal.scss'

export type WhistleblownResourcesModalProps = {
  whistleblows: WhistleblownResourceData[]
  isModerator: boolean
  setIsShowingWhistleblows: (value: SetStateAction<boolean>) => void
}

export const WhistleblownResourcesModal: FC<WhistleblownResourcesModalProps> = ({
  whistleblows,
  isModerator,
  setIsShowingWhistleblows,
}) => {
  return (
    <Modal
      className={'whistleblown-resources-modal'}
      title={isModerator ? 'Resource reports' : 'User reports'}
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
                <div className="whistleblow-date">{getTimeAgo(date)}</div>
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
