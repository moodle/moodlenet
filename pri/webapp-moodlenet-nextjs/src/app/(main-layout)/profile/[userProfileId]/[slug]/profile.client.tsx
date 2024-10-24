'use client'

import { Card } from '../../../../../ui/atoms/Card/Card'
import { MainProfileCard, mainProfileCardProps } from './pageComponents/MainProfileCard/MainProfileCard'

export interface ProfileClientProps {
  mainProfileCardProps: mainProfileCardProps
}

export default function ProfileClient({ mainProfileCardProps }: ProfileClientProps) {
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
        <Card>points</Card>
      </div>
    </div>
  )
}
