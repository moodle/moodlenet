'use client'

import { Card } from '../../../ui/atoms/Card/Card'
import { MainProfileCard } from './components/MainProfileCard'

export default function ProfileClient() {
  return (
    <div className="profile-page">
      <MainProfileCard
        can={{
          edit: false,
          un_approve: false,
          un_follow: false,
          sendMessage: false,
          report: true,
        }}
        is={{
          approved: false,
          following: false,
        }}
      />
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
