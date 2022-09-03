import lib from 'moodlenet-react-app-lib'
import { FC } from 'react'
import { OverallCard } from './OverallCard/OverallCard'
import { ProfileCard } from './ProfileCard/ProfileCard'
import './ProfilePage.scss'

const { MainLayout /* , ListCard, PrimaryButton, Modal, Snackbar, ReportModal, InputTextField  */ } = lib.ui.components

export type ProfilePageProps = {
  displayName: string
  avatarUrl?: string
}

export const ProfilePage: FC<ProfilePageProps> = ({ displayName, avatarUrl }) => {
  return (
    <MainLayout>
      <div className="profile">
        <div className="content">
          <div className="main-column">
            <ProfileCard displayName={displayName} avatarUrl={avatarUrl} />
          </div>
          <div className="side-column">
            <OverallCard {...{ followers: 1, kudos: 2, resources: 3, years: 1221 }} />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
ProfilePage.displayName = 'ProfilePage'
export default ProfilePage
