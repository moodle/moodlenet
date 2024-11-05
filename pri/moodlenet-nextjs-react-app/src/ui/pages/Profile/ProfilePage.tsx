'use client'

import FilterNone from '@mui/icons-material/FilterNone'
import Grade from '@mui/icons-material/Grade'
import PermIdentity from '@mui/icons-material/PermIdentity'

import { _any, selection } from '@moodle/lib-types'
import { moodlenetContributorAccessObject } from '@moodle/module/moodlenet'
import { updateProfileInfoSchema, useProfileImageSchema } from '@moodle/module/user-profile'
import { HookSafeActionFn } from 'next-safe-action/hooks'
import { Card } from '../../atoms/Card/Card'
import { OverallCard } from '../../molecules/OverallCard/OverallCard'
import { MainProfileCard } from './MainProfileCard/MainProfileCard'
import { UserProgressCard } from './UserProgressCard/UserProgressCard'
import { webappContributorAccessData } from '@moodle/module/moodlenet-react-app'
import { ValidationErrors } from 'next-safe-action/.'
import { asset } from '@moodle/module/storage'
import { simpleHookSafeAction } from '../../../lib/common/types'

type actionsOnContributor = {
  edit: {
    updateMyProfileInfo: updateMyProfileInfoFn
    adoptMyProfileImage: adoptMyProfileImageFn
  }
  follow(): Promise<void>
  sendMessage(text: string): Promise<void>
  report(text: string): Promise<void>
}
type adoptMyProfileImageFn = simpleHookSafeAction<useProfileImageSchema, void | asset[]>
type updateMyProfileInfoFn = simpleHookSafeAction<updateProfileInfoSchema, void>

export type profilePageProps = webappContributorAccessData & {
  actions: selection<actionsOnContributor, never, 'edit' | 'follow' | 'sendMessage' | 'report'>
}

export default function ProfilePage(profilePageProps: profilePageProps) {
  const { stats } = profilePageProps
  return (
    <div className="profile-page">
      <div className="main-card">
        <MainProfileCard {...profilePageProps} />
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
        <UserProgressCard points={stats.points} />
      </div>
    </div>
  )
}
