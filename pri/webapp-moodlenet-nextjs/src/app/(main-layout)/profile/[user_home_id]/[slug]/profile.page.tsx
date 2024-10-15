import { priAccess } from '../../../../../lib/server/session-access'
import { params } from '../../../../../lib/server/types'
import { Fallback } from '../../../../../ui/pages/Fallback/Fallback'
import { MainProfileCardDeps } from './components/MainProfileCard'
import ProfileClient from './profile.client'

export default async function ProfilePage({
  params: { user_home_id },
}: {
  params: params<'user_home_id' | 'slug'>
}) {
  const [foundUserHome, userHome] = await priAccess().userHome.query.userHome({
    by: { idOf: 'user_home', user_home_id },
  })
  if (!foundUserHome) {
    return <Fallback />
  }

  const mainProfileCardDeps: MainProfileCardDeps = {
    userProfile: {
      flags: {
        followed: userHome.accessObject.flags.followed,
        isPublisher: !!userHome.accessObject.user?.roles.includes('publisher'),
      },
      id: user_home_id,
      permissions: {
        canEdit: userHome.accessObject.permissions.editProfile,
        editRoles: userHome.accessObject.permissions.editRoles,
        follow: userHome.accessObject.permissions.follow,
        report: userHome.accessObject.permissions.report,
        sendMessage: userHome.accessObject.permissions.sendMessage,
      },
      profileInfo: {
        aboutMe: userHome.accessObject.profileInfo.aboutMe,
        displayName: userHome.accessObject.profileInfo.displayName,
        location: userHome.accessObject.profileInfo.location,
        siteUrl: userHome.accessObject.profileInfo.siteUrl,
      },
    },
  }

  return <ProfileClient mainProfileCardDeps={mainProfileCardDeps} />
}
