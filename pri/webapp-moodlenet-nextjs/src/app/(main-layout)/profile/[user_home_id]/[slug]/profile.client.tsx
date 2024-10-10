'use client'

import { Card } from '../../../../../ui/atoms/Card/Card'
import { MainProfileCard, MainProfileCardDeps } from './components/MainProfileCard'

export interface ProfileClientProps {
  mainProfileCardDeps: MainProfileCardDeps
}

export default function ProfileClient({ mainProfileCardDeps }: ProfileClientProps) {
  return (
    <div className="profile-page">
      <MainProfileCard {...mainProfileCardDeps} />
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
