import { redirect } from 'next/navigation'
import { appRoutes } from '../../../../../lib/common/appRoutes'
import { pageProps, paramRequired } from '../../../../../lib/server/page-props'
import session from '../../../../../lib/server/session-client'
import { Fallback } from '../../../../../ui/pages/Fallback/Fallback'
import ProfilePageClient, { profilePageProps } from '../../../../../ui/pages/Profile/ProfilePage'
import { getApplyMyProfileImageSafeAction, getUpdateMyProfileInfoMetaSafeAction } from './profile.server'

export default async function ProfilePage({ params }: pageProps<{ moodlenetContributorId: string; slug: string }>) {
  const [moodlenetContributorId, slug] = await Promise.all([paramRequired('moodlenetContributorId', params), paramRequired('slug', params)])
  const [foundContributor, webappContributorAccessData] = await client.proxy.moodlenetReactApp.props.profilePage({
    moodlenetContributorId,
  })
  if (!foundContributor) {
    return <Fallback />
  }

  if (webappContributorAccessData.slug !== slug) {
    redirect(appRoutes(`/profile/${moodlenetContributorId}/${webappContributorAccessData.slug}`))
  }
  const { id: userProfileId } = webappContributorAccessData
  const { permissions } = webappContributorAccessData
  const profilePageProps: profilePageProps = {
    ...webappContributorAccessData,
    actions: {
      edit: permissions.editProfileInfo
        ? {
            updateMyProfileInfo: await getUpdateMyProfileInfoMetaSafeAction({ userProfileId }),
            useAsMyProfileAvatar: await getApplyMyProfileImageSafeAction({ userProfileId, type: 'avatar' }),
            useAsMyProfileBackground: await getApplyMyProfileImageSafeAction({ userProfileId, type: 'background' }),
          }
        : null,
      follow: permissions.follow ? null : null,
      report: permissions.report ? null : null,
      sendMessage: permissions.sendMessage ? null : null,
    },
  }

  return <ProfilePageClient {...profilePageProps} />
}
