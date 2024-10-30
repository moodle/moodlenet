'use client'
import { moodlenetContributorMinimalInfo } from '@moodle/module/moodlenet-react-app'
import Link from 'next/link'
import { useAssetUrl, usePointSystem } from '../../../../lib/client/globalContexts'
import { getUserLevelDetails } from '../../../../lib/client/user-levels/lib'
import { sitepaths } from '../../../../lib/common/sitepaths'
import { Card } from '../../../../ui/atoms/Card/Card'
import { ReactComponent as LeafIcon } from '../../../../ui/lib/assets/icons/leaf.svg'
import defaultAvatar from '../../../../ui/lib/assets/img/default-avatar.svg'
import './Leaderboard.scss'

export type leaderboardProps = {
  leaderContributors: moodlenetContributorMinimalInfo[]
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
function LeaderRow({ contributor, position }: { contributor: moodlenetContributorMinimalInfo; position: number }) {
  const { pointSystem } = usePointSystem()
  const profileUrl = sitepaths.profile[contributor.id]![contributor.slug]!()
  const { pointAvatar, level } = getUserLevelDetails(pointSystem, contributor.points)
  const [avatarUrl] = useAssetUrl(contributor.avatar, defaultAvatar)
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
        <Link className="avatar" href={profileUrl}>
          <img className="profile-avatar" src={avatarUrl} alt="avatar" />
          <div className={`level-avatar-container level-${level}`}>
            <img className="level-avatar" src={pointAvatar} alt="level avatar" />
          </div>
        </Link>
        <Link className="name" href={profileUrl}>
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
}
