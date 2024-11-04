import { redirect } from 'next/navigation'
import { appRoutes } from '../../../../../lib/common/appRoutes'
import { access } from '../../../../../lib/server/session-access'
import { params } from '../../../../../lib/server/types'
import { Fallback } from '../../../../../ui/pages/Fallback/Fallback'
import ProfilePageClient, { profilePageProps } from '../../../../../ui/pages/Profile/ProfilePage'
import { adoptMyProfileImage, updateMyProfileInfoMetaForm } from './profile.server'

export default async function ProfilePage({
  params: { moodlenetContributorId, slug },
}: {
  params: params<'moodlenetContributorId' | 'slug'>
}) {
  const [foundContributor, profilePageData] = await access.primary.moodlenetReactApp.props.profilePage({
    moodlenetContributorId,
  })
  if (!foundContributor) {
    return <Fallback />
  }
  const { moodlenetContributorAccessObject } = profilePageData
  if (moodlenetContributorAccessObject.slug !== slug) {
    redirect(appRoutes(`/profile/${moodlenetContributorId}/${moodlenetContributorAccessObject.slug}`))
  }
  const { permissions, itsMe, profileInfo } = moodlenetContributorAccessObject
  const profilePageProps: profilePageProps = {
    profileInfo,
    contributorId: moodlenetContributorId,
    itsMe,
    stats: {
      points: moodlenetContributorAccessObject.stats.points,
      followersCount: profilePageData.stats.followersCount,
      followingCount: profilePageData.stats.followingCount,
      publishedResourcesCount: profilePageData.stats.publishedResourcesCount,
    },
    actions: {
      updateMyProfileInfo: permissions.editProfileInfo ? updateMyProfileInfoMetaForm : null,
      adoptMyProfileImage: permissions.editProfileInfo ? adoptMyProfileImage : null,
      follow: permissions.follow ? null : null,
      report: permissions.report ? null : null,
      sendMessage: permissions.sendMessage ? null : null,
    },
    drafts: itsMe
      ? {
          eduCollections: [],
          eduResources: [],
        }
      : null,
  }

  return <ProfilePageClient {...profilePageProps} />
}
