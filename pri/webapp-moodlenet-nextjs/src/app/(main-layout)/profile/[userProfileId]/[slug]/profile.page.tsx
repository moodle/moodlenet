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
  const [foundUserProfile, userProfileResponse] = await primary.moodle.userProfile.userProfile.access({
    by: 'userProfileId',
    userProfileId,
  })
  if (!foundUserProfile) {
    return <Fallback />
  }
  if (userProfileResponse.accessObject.urlSafeProfileName !== slug) {
    redirect(sitepaths.profile[userProfileResponse.accessObject.id]![userProfileResponse.accessObject.urlSafeProfileName]!())
  }

  const mainProfileCardDeps: mainProfileCardProps = {
    userProfile: userProfileResponse.accessObject,
  }

  return <ProfileClient mainProfileCardDeps={mainProfileCardDeps} />
}
