'use client'

import FilterNone from '@mui/icons-material/FilterNone'
import Grade from '@mui/icons-material/Grade'
import PermIdentity from '@mui/icons-material/PermIdentity'

import { _nullish, selection } from '@moodle/lib-types'
import { moodlenetContributorId } from '@moodle/module/moodlenet'
import { profileInfo, updateProfileInfoSchema, useProfileImageSchema } from '@moodle/module/user-profile'
import { HookSafeActionFn } from 'next-safe-action/hooks'
import { Card } from '../../atoms/Card/Card'
import { OverallCard } from '../../molecules/OverallCard/OverallCard'
import { MainProfileCard } from './MainProfileCard/MainProfileCard'
import { UserProgressCard } from './UserProgressCard/UserProgressCard'

type actionsOnContributor = {
  updateMyProfileInfo: updateMyProfileInfoFn
  adoptMyProfileImage: adoptMyProfileImageFn
  follow(): Promise<void>
  sendMessage(text: string): Promise<void>
  report(text: string): Promise<void>
}
type adoptMyProfileImageFn = HookSafeActionFn<unknown, useProfileImageSchema, any, any, any, any>
type updateMyProfileInfoFn = HookSafeActionFn<unknown, updateProfileInfoSchema, any, any, any, any>

export interface profilePageProps {
  actions: selection<
    actionsOnContributor,
    never,
    'adoptMyProfileImage' | 'updateMyProfileInfo' | 'follow' | 'sendMessage' | 'report'
  >
  profileInfo: profileInfo
  itsMe: boolean
  contributorId: moodlenetContributorId
  stats: { points: number; followersCount: number; followingCount: number; publishedResourcesCount: number }
  drafts:
    | _nullish
    | {
        eduCollections: eduCollectionCardProps[] // { data: eduCollectionData; resourceAmount: number; route: appRoute }[]
        // eduResources: eduResourceCardProps[] // { data: eduResourceData; route: appRoute }[]
      }
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
