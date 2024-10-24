'use client'

import PermIdentity from '@mui/icons-material/PermIdentity'
import Grade from '@mui/icons-material/Grade'
import FilterNone from '@mui/icons-material/FilterNone'

import { Card } from '../../../../../ui/atoms/Card/Card'
import { OverallCard } from '../../../../../ui/molecules/OverallCard/OverallCard'
import { MainProfileCard, mainProfileCardProps } from './pageComponents/MainProfileCard/MainProfileCard'
import { UserProgressCard, userProgressCardProps } from './pageComponents/UserProgressCard/UserProgressCard'

export interface ProfileClientProps {
  mainProfileCardProps: mainProfileCardProps
  userProgressCardProps: userProgressCardProps
  stats: { followersCount: number; followingCount: number; publishedResourcesCount: number }
}

export default function ProfileClient({ mainProfileCardProps, userProgressCardProps, stats }: ProfileClientProps) {
  return (
    <div className="profile-page">
      <div className="main-card">
        <MainProfileCard {...mainProfileCardProps} />
      </div>
      <div className="resources">
        <Card>resources</Card>
      </div>
      <div className="collections">
        <Card>collections</Card>
      </div>
      <div className="overall">
        <OverallCard
          items={[
            {
              Icon: PermIdentity,
              name: 'Followers',
              className: 'followers',
              value: stats.followersCount,
              // href: followers,
            },
            {
              Icon: Grade,
              name: 'Following',
              className: 'following',
              value: stats.followingCount,
              // href: following
            },
            {
              Icon: FilterNone,
              name: 'Resources',
              className: 'resources',
              value: stats.publishedResourcesCount,
            },
          ]}
        />
      </div>
      <div className="points">
        <UserProgressCard {...userProgressCardProps} />
      </div>
    </div>
  )
}
