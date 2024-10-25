'use client'
import { contributorInfo } from 'domain/src/modules/moodlenet/types/contributor'
import { pointSystem } from 'domain/src/modules/moodlenet/types/point-system'
import Link from 'next/link'
import { useAssetUrl } from '../../../../lib/client/globalContexts'
import { getUserLevelDetails } from '../../../../lib/client/user-levels/lib'
import { sitepaths } from '../../../../lib/common/utils/sitepaths'
import { Card } from '../../../../ui/atoms/Card/Card'
import { ReactComponent as LeafIcon } from '../../../../ui/lib/assets/icons/leaf.svg'
import defaultAvatar from '../../../../ui/lib/assets/img/default-avatar.svg'
import './Leaderboard.scss'

console.dir({ LeafIcon }, { depth: 10, colors: true, showHidden: true, getters: true })
export type leaderboardProps = {
  leaderContributors: contributorInfo[]
  pointSystem: pointSystem
}

export function Leaderboard({ leaderContributors, pointSystem }: leaderboardProps) {
  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <div className="title">Leaderboard</div>
        <div className="subtitle">Exceptional contributors leading the way</div>
      </div>
      <Card className="leaderboard">
        {leaderContributors.map((contributor, index) => (
          <LeaderRow key={index} {...{ contributor, pointSystem, position: index + 1 }} />
        ))}
      </Card>
    </div>
  )
}
function LeaderRow({
  contributor,
  position,
  pointSystem,
}: {
  contributor: contributorInfo
  position: number
  pointSystem: pointSystem
}) {
  const profileUrl = sitepaths.profile[contributor.profileId]![contributor.urlSafeProfileName]!()
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
