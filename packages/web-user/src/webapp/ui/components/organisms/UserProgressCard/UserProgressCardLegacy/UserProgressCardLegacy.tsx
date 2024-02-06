// import { t, Trans } from '@lingui/macro'
import { Card } from '@moodlenet/component-library'
// import { Card } from '@moodlenet/react-app'
import type { FC } from 'react'
// import { Href, Link } from '../../../../elements/link'
import { InfoOutlined } from '@mui/icons-material'
import { ReactComponent as LeafIcon } from '../../../assets/icons/leaf.svg'
import level1Avatar from '../../../assets/img/userLevelAvatar/level-1.png'
import level10Avatar from '../../../assets/img/userLevelAvatar/level-10.png'
import level2Avatar from '../../../assets/img/userLevelAvatar/level-2.png'
import level3Avatar from '../../../assets/img/userLevelAvatar/level-3.png'
import level4Avatar from '../../../assets/img/userLevelAvatar/level-4.png'
import level5Avatar from '../../../assets/img/userLevelAvatar/level-5.png'
import level6Avatar from '../../../assets/img/userLevelAvatar/level-6.png'
import level7Avatar from '../../../assets/img/userLevelAvatar/level-7.png'
import level8Avatar from '../../../assets/img/userLevelAvatar/level-8.png'
import level9Avatar from '../../../assets/img/userLevelAvatar/level-9.png'
import './UserProgressCard.scss'

type LevelDetails = {
  minPoints: number
  maxPoints: number
  avatar: string
  title: string
  level: number
}

export const userLevels: LevelDetails[] = [
  { minPoints: 0, maxPoints: 14, title: 'Ambitious seed', level: 1, avatar: level1Avatar },
  { minPoints: 15, maxPoints: 74, title: 'Determined sprout', level: 2, avatar: level2Avatar },
  { minPoints: 75, maxPoints: 249, title: 'Rooted learner', level: 3, avatar: level3Avatar },
  { minPoints: 250, maxPoints: 499, title: 'Seedling scholar', level: 4, avatar: level4Avatar },
  { minPoints: 500, maxPoints: 1499, title: 'Steadily grower', level: 5, avatar: level5Avatar },
  { minPoints: 1500, maxPoints: 4999, title: 'Photosyntesist', level: 6, avatar: level6Avatar },
  { minPoints: 5000, maxPoints: 14999, title: 'Sky reacher', level: 7, avatar: level7Avatar },
  { minPoints: 15000, maxPoints: 49999, title: 'Firmly grounded', level: 8, avatar: level8Avatar },
  { minPoints: 50000, maxPoints: 99999, title: 'Versatile canopy', level: 9, avatar: level9Avatar },
  {
    minPoints: 100000,
    maxPoints: Infinity,
    title: 'Dazzling biome',
    level: 10,
    avatar: level10Avatar,
  },
]

export const getUserLevelDetails = (points: number): LevelDetails => {
  for (const level of userLevels) {
    if (points >= level.minPoints && points <= level.maxPoints) {
      return level
    }
  }

  return (
    userLevels[userLevels.length - 1] ?? {
      minPoints: 0,
      maxPoints: 14,
      title: 'Ambitious seed',
      level: 1,
      avatar: level1Avatar,
    }
  )
}

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
    <abbr className="learn-more" title="Learn more">
      <InfoOutlined />
    </abbr>
  )

  return (
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
  )
}

UserProgressCard.defaultProps = {}
