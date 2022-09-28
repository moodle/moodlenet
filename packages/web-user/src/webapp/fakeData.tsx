import { OverallCardProps } from './ProfilePage/OverallCard/OverallCard.js'
import { ProfileCardProps } from './ProfilePage/ProfileCard/ProfileCard_orig_Bru.js'
import { ProfilePageProps } from './ProfilePage/ProfilePage_orig_Bru.js'
import { ProfileFormValues } from './types.mjs'

const overallCardProps: OverallCardProps = {
  followers: 11,
  kudos: 109,
  resources: 0,
  years: 1,
}

const editForm: ProfileFormValues = {
  displayName: 'Alberto Curcella',
  description: '',
  avatarImage: 'https://moodle.net/assets/01F/T/N/3/X/3CGXZ0TQRN1EX27D7WY/01FTN3X3CGXZ0TQRN1EX27D7WY.jpg',
  backgroundImage:
    'https://images.unsplash.com/photo-1450045439515-ff27c2f2e6b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDQ5NjR8MHwxfHNlYXJjaHw1fHx3aGFsZXxlbnwwfDB8fHwxNjU0NzU2NzU3&ixlib=rb-1.2.1&q=80&w=1080',
  location: 'San Felipe, Mexico',
  organizationName: 'Moodle Pty Ltd',
  siteUrl: 'https://moodle.com',
}

const profileCardProps: ProfileCardProps = {
  isAuthenticated: true,
  openSendMessage: () => {},
  profileUrl: 'alberto-curcella',
  toggleIsEditing: () => {},
  editForm: editForm,
  isOwner: true,
  userId: 'alberto-curcella-1234',
  setShowUserIdCopiedAlert: (): void => {
    throw new Error('Function not implemented.')
  },
  setShowUrlCopiedAlert: (): void => {
    throw new Error('Function not implemented.')
  },
  setIsReporting: (): void => {
    throw new Error('Function not implemented.')
  },
}

export const fakeProfilePageProps: ProfilePageProps = {
  displayName: '',
  overallCardProps: overallCardProps,
  profileCardProps: profileCardProps,
  editForm: editForm,
}
