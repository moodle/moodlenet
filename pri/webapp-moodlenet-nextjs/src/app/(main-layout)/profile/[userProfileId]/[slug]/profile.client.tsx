'use client'

import { Card } from '../../../../../ui/atoms/Card/Card'
import { MainProfileCard, mainProfileCardProps } from './pageComponents/MainProfileCard/MainProfileCard'
import { UserProgressCard, userProgressCardProps } from './pageComponents/UserProgressCard/UserProgressCard'

export interface ProfileClientProps {
  mainProfileCardProps: mainProfileCardProps
  userProgressCardProps: userProgressCardProps
}

export default function ProfileClient({ mainProfileCardProps, userProgressCardProps }: ProfileClientProps) {
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
        <Card>overall</Card>
      </div>
      <div className="points">
        <UserProgressCard {...userProgressCardProps} />
      </div>
    </div>
  )
}
