import { Card } from '@moodlenet/component-library'
import type { FC } from 'react'

import { Link } from '@moodlenet/react-app/ui'
import type { LeaderBoardContributor } from '../../../../../common/types.mjs'
import { getUserLevelDetails } from '../../../../gamification/user-levels.mjs'
import { ReactComponent as LeafIcon } from '../../../assets/icons/leaf.svg'
import defaultAvatar from '../../../assets/img/default-avatar.svg'
import './Leaderboard.scss'

export type LeaderboardProps = {
  contributors: LeaderBoardContributor[]
}

export const Leaderboard: FC<LeaderboardProps> = ({ contributors }) => {
  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <div className="title">Leaderboard</div>
        <div className="subtitle">Exceptional contributors leading the way</div>
      </div>
      <Card className="leaderboard">
        {contributors.map((contributor, index) => {
          const { avatar, level } = getUserLevelDetails(contributor.points)
          return (
            <div key={index} className="contributor">
              <div className="contributor-head">
                <div className="rank">
                  {index < 3 ? (
                    <div className={`medal rank-${index + 1}`}>
                      <LeafIcon />
                    </div>
                  ) : (
                    index + 1
                  )}
                </div>
                <Link className="avatar" href={contributor.profileHref}>
                  <img
                    className="profile-avatar"
                    src={contributor.avatarUrl || defaultAvatar}
                    alt="avatar"
                  />
                  <div className={`level-avatar-container level-${level}`}>
                    <img className="level-avatar" src={avatar} alt="level avatar" />
                  </div>
                </Link>
                <Link className="name" href={contributor.profileHref}>
                  {contributor.displayName}
                </Link>
              </div>
              <div className="score">
                {contributor.points.toLocaleString()}
                <LeafIcon />
              </div>
              {/*  <div className="subject">{contributor.subject}</div> */}
            </div>
          )
        })}
      </Card>
    </div>
  )
}

Leaderboard.defaultProps = {}
