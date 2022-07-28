import { OverallCardProps } from './ProfilePage/OverallCard/OverallCard'
import { ProfileCardProps } from './ProfilePage/ProfileCard/ProfileCard'
import { ProfilePageProps } from './ProfilePage/ProfilePage'

const overallCardProps: OverallCardProps = {
  followers: 11,
  kudos: 109,
  resources: 0,
  years: 1,
}

const profileCardProps: ProfileCardProps = {
  isAuthenticated: true,
  openSendMessage: () => {},
  profileUrl: 'alberto-curcella',
  toggleIsEditing: () => {},
}

export const fakeProfilePageProps: ProfilePageProps = {
  displayName: '',
  overallCardProps: overallCardProps,
  profileCardProps: profileCardProps,
}
