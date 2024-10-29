'use client'

import FilterNone from '@mui/icons-material/FilterNone'
import Grade from '@mui/icons-material/Grade'
import PermIdentity from '@mui/icons-material/PermIdentity'

import { moodlenetContributorAccessObject } from '@moodle/module/moodlenet'
import { profilePageProps } from '@moodle/module/moodlenet-react-app'
import { Card } from '../../../../../ui/atoms/Card/Card'
import { OverallCard } from '../../../../../ui/molecules/OverallCard/OverallCard'
import { MainProfileCard } from './pageComponents/MainProfileCard/MainProfileCard'
import { UserProgressCard, userProgressCardProps } from './pageComponents/UserProgressCard/UserProgressCard'

export interface ProfileClientProps {
  moodlenetContributorAccessObject: moodlenetContributorAccessObject
  userProgressCardProps: userProgressCardProps
  stats: { followersCount: number; followingCount: number; publishedResourcesCount: number }
}

export default function ProfileClient({ moodlenetContributorAccessObject, stats }: profilePageProps) {
  return (
    <div className="profile-page">
      <div className="main-card">
        <MainProfileCard {...{ moodlenetContributorAccessObject }} />
      </div>
      <div className="resources">
        <Card>
          <Card>resources</Card>
          <Card>resources</Card>
          <Card>resources</Card>
          <Card>resources</Card>
          <Card>resources</Card>
          <Card>resources</Card>
          <Card>resources</Card>
          <Card>resources</Card>
          <Card>resources</Card>
          <Card>resources</Card>
          <Card>resources</Card>
          <Card>resources</Card>
          <Card>resources</Card>
          <Card>resources</Card>
          <Card>resources</Card>
          <Card>resources</Card>
          <Card>resources</Card>
          <Card>resources</Card>
          <Card>resources</Card>
          <Card>resources</Card>
          <Card>resources</Card>
          <Card>resources</Card>
          <Card>resources</Card>
          <Card>resources</Card>
          <Card>resources</Card>
        </Card>
      </div>
      <div className="collections">
        <Card>
          <Card>collections</Card>
          <Card>collections</Card>
          <Card>collections</Card>
          <Card>collections</Card>
          <Card>collections</Card>
          <Card>collections</Card>
          <Card>collections</Card>
          <Card>collections</Card>
          <Card>collections</Card>
          <Card>collections</Card>
          <Card>collections</Card>
          <Card>collections</Card>
          <Card>collections</Card>
          <Card>collections</Card>
          <Card>collections</Card>
          <Card>collections</Card>
          <Card>collections</Card>
        </Card>
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
        <UserProgressCard points={moodlenetContributorAccessObject.stats.points} />
      </div>
    </div>
  )
}
