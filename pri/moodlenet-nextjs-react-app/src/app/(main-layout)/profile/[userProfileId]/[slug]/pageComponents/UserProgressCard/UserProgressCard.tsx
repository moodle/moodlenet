// import { t, Trans } from '@lingui/macro'
// import { Card } from '@moodlenet/react-app'
import { useEffect, useRef, useState } from 'react'
// import { Href, Link } from '../../../../elements/link'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { pointSystem } from 'domain/src/modules/moodlenet/types/point-system'
import { Card } from '../../../../../../../ui/atoms/Card/Card'
import { Modal } from '../../../../../../../ui/atoms/Modal/Modal'
import { ReactComponent as LeafIcon } from '../../../../../../../ui/lib/assets/icons/leaf.svg'
import {
  actionsAndPointsObtained,
  getLevelDetails,
  getUserLevelDetails,
} from '../../../../../../../lib/client/user-levels/lib'
import './UserProgressCard.scss'

export type userProgressCardProps = {
  points: number
  pointSystem: pointSystem
}

export function UserProgressCard({ points, pointSystem }: userProgressCardProps) {
  const { level, title, minPoints, maxPoints, pointAvatar: avatar } = getUserLevelDetails(pointSystem, points)

  const progressBarWidth = ((points - minPoints) / (maxPoints - minPoints)) * 100

  const learnMore = (
    <abbr className="learn-more" title="Learn more" onClick={() => setShowInfoModal(true)}>
      <InfoOutlined />
    </abbr>
  )

  const [showInfoModal, setShowInfoModal] = useState(false)
  const infoModalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const modalEl = infoModalRef.current
      if (modalEl) {
        if (modalEl.scrollTop <= 0) {
          modalEl.parentElement?.classList.add('top-reached')
        } else {
          modalEl.parentElement?.classList.remove('top-reached')
        }
        if (modalEl.scrollHeight - modalEl.scrollTop === modalEl.clientHeight) {
          modalEl.parentElement?.classList.add('bottom-reached')
        } else {
          modalEl.parentElement?.classList.remove('bottom-reached')
        }
      }
    }

    const modalEl = infoModalRef.current
    if (modalEl) {
      modalEl.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (modalEl) {
        modalEl.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  const infoModal = showInfoModal && (
    <Modal
      className="user-progress-info-modal"
      onClose={() => setShowInfoModal(false)}
      contentRef={infoModalRef}
      // closeButton={false}
    >
      <div className="levels">
        <div className="title">Levels</div>
        <div className="rows">
          {getLevelDetails(pointSystem).map((level, index) => (
            <div className="row" key={index}>
              <div className={`level`}>Level {level.level}</div>
              <div className="points">
                <span className="min">{level.minPoints.toLocaleString()}</span>
                <img src={LeafIcon.src} />
              </div>
              <div className={`level-avatar level-${level.level}`}>
                <img className="avatar" src={level.pointAvatar} alt="level avatar" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="leaves">
        <div className="title">Leaves</div>
        <div className="rows">
          {actionsAndPointsObtained(pointSystem).map((action, index) => (
            <div className="row" key={index}>
              <abbr className={`action`} title={action.abbr ?? ''}>
                {' '}
                {action.action}
              </abbr>
              <div className="points">
                <span className="points">{action.points.toLocaleString()}</span>
                <img src={LeafIcon.src} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )

  return (
    <>
      {infoModal}
      <Card className="user-progress-card" key="user-progress-card">
        <div className={`level-avatar level-${level}`}>
          <img className="avatar" src={avatar} alt="level avatar" />
        </div>
        <div className="level-title">
          <div className="title">
            {title}
            {learnMore}
          </div>
          <span className="level">Level {level}</span>
        </div>
        <div className="progress-info">
          <div className="progress-bar">
            <div
              className={`progress ${level === 10 ? 'top-level' : ''}`}
              style={{ width: `${level < 10 ? progressBarWidth : 100}%` }}
            />
          </div>
          <div className="points-range">
            <div className="min">{minPoints.toLocaleString()}</div>
            <div className="current">
              <span className="current">{points.toLocaleString()}</span>
              <LeafIcon />
            </div>
            <div className="max">{level < 10 ? maxPoints.toLocaleString() : '\u221E'}</div>
          </div>
        </div>
      </Card>
    </>
  )
}
