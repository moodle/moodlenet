// import { t, Trans } from '@lingui/macro'
import { Card, Modal } from '@moodlenet/component-library'
// import { Card } from '@moodlenet/react-app'
import { useState, type FC } from 'react'
// import { Href, Link } from '../../../../elements/link'
import { InfoOutlined } from '@mui/icons-material'
import {
  actionsAndPointsObtained,
  getUserLevelDetails,
  userLevels,
} from '../../../../../common/gamification/user-levels.mjs'
import { ReactComponent as LeafIcon } from '../../../assets/icons/leaf.svg'
import './UserProgressCard.scss'

export type UserProgressCardProps = {
  points: number
  // oldPoints: number
}

export const UserProgressCard: FC<UserProgressCardProps> = ({
  points,
  // oldPoints,
}) => {
  const { level, title, minPoints, maxPoints, avatar } = getUserLevelDetails(points)

  const progressBarWidth = (points / maxPoints) * 100

  const learnMore = (
    <abbr className="learn-more" title="Learn more" onClick={() => setShowInfoModal(true)}>
      <InfoOutlined />
    </abbr>
  )

  const [showInfoModal, setShowInfoModal] = useState(false)
  const infoModal = showInfoModal && (
    <Modal
      className="user-progress-info-modal"
      onClose={() => setShowInfoModal(false)}
      // closeButton={false}
    >
      <div className="levels">
        <div className="title">Levels</div>
        {userLevels.map((level, index) => (
          <div className="row" key={index}>
            <div className={`level`}>Level {level.level}</div>
            <div className="points">
              <span className="min">{level.minPoints.toLocaleString()}</span>
              <LeafIcon />
            </div>
            <div className={`level-avatar level-${level.level}`}>
              <img className="avatar" src={level.avatar} alt="level avatar" />
            </div>
          </div>
        ))}
      </div>
      <div className="leaves">
        <div className="title">Leaves</div>
        {actionsAndPointsObtained.map((action, index) => (
          <div className="row" key={index}>
            <abbr className={`action`} title={action.abbr ?? ''}>
              {' '}
              {action.action}
            </abbr>
            <div className="points">
              <span className="points">{action.points.toLocaleString()}</span>
              <LeafIcon />
            </div>
          </div>
        ))}
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
            {title} - Level {level}
          </div>
          {learnMore}
        </div>
        <div className="progress-info">
          <div className="progress-bar">
            <div className="progress" style={{ width: progressBarWidth }} />
          </div>
          <div className="points-range">
            <div className="min">{minPoints}</div>
            <div className="current-max">
              <LeafIcon />
              <span className="current">{points}</span>
              <span className="max">/{maxPoints}</span>
            </div>
          </div>
        </div>
      </Card>
    </>
  )
}

UserProgressCard.defaultProps = {}
