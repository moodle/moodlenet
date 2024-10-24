import { redirect } from 'next/navigation'
import { sitepaths } from '../../../../../lib/common/utils/sitepaths'
import { primary } from '../../../../../lib/server/session-access'
import { params } from '../../../../../lib/server/types'
import { Fallback } from '../../../../../ui/pages/Fallback/Fallback'
import { mainProfileCardProps } from './pageComponents/MainProfileCard/MainProfileCard'
import ProfileClient, { ProfileClientProps } from './profile.client'
import { userProgressCardProps } from './pageComponents/UserProgressCard/UserProgressCard'

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
  if (userProfileResponse.accessObject.appData.urlSafeProfileName !== slug) {
    redirect(
      sitepaths.profile[userProfileResponse.accessObject.id]![
        userProfileResponse.accessObject.appData.urlSafeProfileName
      ]!(),
    )
  }
  const { pointSystem } = await primary.moodle.net.session.moduleInfo()
  const moodlenetData = userProfileResponse.accessObject.appData.moodlenet
  const userProgressCardProps: userProgressCardProps = {
    points: moodlenetData.points.amount,
    pointSystem,
  }
  const mainProfileCardProps: mainProfileCardProps = {
    userProfile: userProfileResponse.accessObject,
  }
  const featuredContent = moodlenetData.featuredContent
  const profileClientProps: ProfileClientProps = {
    mainProfileCardProps,
    userProgressCardProps,
    stats: {
      followersCount: moodlenetData.stats.followersCount,
      followingCount: featuredContent.filter(({ featureType }) => featureType === 'follow').length,
      publishedResourcesCount: moodlenetData.published.contributions.filter(({ status }) => status === 'published').length,
    },
  }

  return <ProfileClient {...profileClientProps} />
}
