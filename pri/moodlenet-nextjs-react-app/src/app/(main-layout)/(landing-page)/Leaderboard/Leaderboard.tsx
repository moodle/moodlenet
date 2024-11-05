'use client'
import Link from 'next/link'
import { useAssetUrl, usePointSystem } from '../../../../lib/client/globalContexts'
import { getUserLevelDetails } from '../../../../lib/client/user-levels/lib'
import { Card } from '../../../../ui/atoms/Card/Card'
import { ReactComponent as LeafIcon } from '../../../../ui/lib/assets/icons/leaf.svg'
import defaultAvatar from '../../../../ui/lib/assets/img/default-avatar.svg'
import { profileCardProps } from '../../../../ui/molecules/ProfileCard/ProfileCard'
import './Leaderboard.scss'

export type leaderboardProps = {
  leaderContributors: leaderRowProps[]
}

export function Leaderboard({ leaderContributors }: leaderboardProps) {
  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <div className="title">Leaderboard</div>
        <div className="subtitle">Exceptional contributors leading the way</div>
      </div>
      <Card className="leaderboard">
        {leaderContributors.map((contributor, index) => (
          <LeaderRow key={index} {...{ contributor, position: index + 1 }} />
        ))}
      </Card>
    </div>
  )
}
export type leaderRowProps = Pick<profileCardProps, 'profileInfo' | 'profileHomeRoute' | 'stats'>

function LeaderRow({ contributor, position }: { contributor: leaderRowProps; position: number }) {
  const { pointSystem } = usePointSystem()

  const { pointAvatar, level } = getUserLevelDetails(pointSystem, contributor.stats.points)
  const [avatarUrl] = useAssetUrl(contributor.profileInfo.avatar, defaultAvatar)
  return (
    <div key={position} className="contributor">
      <div className="contributor-head">
        <div className="rank">
          {position < 4 ? (
            <div className={`medal rank-${position}`}>
              <LeafIcon />
            </div>
          ) : (
            position
          )}
        </div>
        <Link className="avatar" href={contributor.profileHomeRoute}>
          <img className="profile-avatar" src={avatarUrl} alt="avatar" />
          <div className={`level-avatar-container level-${level}`}>
            <img className="level-avatar" src={pointAvatar} alt="level avatar" />
          </div>
        </Link>
        <Link className="name" href={contributor.profileHomeRoute}>
          {contributor.profileInfo.displayName}
        </Link>
      </div>
      <div className="score">
        {contributor.stats.points.toLocaleString()}
        <LeafIcon />
      </div>
      {/*  <div className="subject">{contributor.subject}</div> */}
    </div>
  )
}
