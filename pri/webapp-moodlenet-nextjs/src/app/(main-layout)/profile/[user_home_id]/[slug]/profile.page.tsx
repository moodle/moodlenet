import { redirect } from 'next/navigation'
import { sitepaths } from '../../../../../lib/common/utils/sitepaths'
import { primary } from '../../../../../lib/server/session-access'
import { params } from '../../../../../lib/server/types'
import { Fallback } from '../../../../../ui/pages/Fallback/Fallback'
import { mainProfileCardProps } from './components/MainProfileCard'
import ProfileClient from './profile.client'

export default async function ProfilePage({
  params: { userProfileId, slug },
}: {
  params: params<'userProfileId' | 'slug'>
}) {
  const [foundUserProfile, userProfile] = await primary.moodle.userProfile.userProfile.access({
    by: { idOf: 'userProfile', userProfileId },
  })
  if (!foundUserProfile) {
    return <Fallback />
  }
  if (userProfile.accessObject.profileInfo.urlSafeName !== slug) {
    redirect(sitepaths.profile[userProfile.accessObject.id]![userProfile.accessObject.profileInfo.urlSafeName]!())
  }

  const mainProfileCardDeps: mainProfileCardProps = {
    userProfile: userProfile.accessObject,
  }

  return <ProfileClient mainProfileCardDeps={mainProfileCardDeps} />
}
