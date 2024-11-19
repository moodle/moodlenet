import { redirect } from 'next/navigation'
import { appRoutes } from '../../../../../lib/common/appRoutes'
import { access } from '../../../../../lib/server/session-access'
import { params } from '../../../../../lib/server/types'
import { Fallback } from '../../../../../ui/pages/Fallback/Fallback'
import ProfilePageClient, { profilePageProps } from '../../../../../ui/pages/Profile/ProfilePage'
import { getApplyMyProfileImageadoptAssetService, updateMyProfileInfoMetaForm } from './profile.server'

export default async function ProfilePage({
  params: { moodlenetContributorId, slug },
}: {
  params: params<'moodlenetContributorId' | 'slug'>
}) {
  const [foundContributor, webappContributorAccessData] = await access.primary.moodlenetReactApp.props.profilePage({
    moodlenetContributorId,
  })
  if (!foundContributor) {
    return <Fallback />
  }
  if (webappContributorAccessData.slug !== slug) {
    redirect(appRoutes(`/profile/${moodlenetContributorId}/${webappContributorAccessData.slug}`))
  }
  const { permissions } = webappContributorAccessData
  const profilePageProps: profilePageProps = {
    ...webappContributorAccessData,
    actions: {
      edit: permissions.editProfileInfo
        ? {
            updateMyProfileInfo: updateMyProfileInfoMetaForm,
            useAsMyProfileAvatar: await getApplyMyProfileImageadoptAssetService('avatar'),
            useAsMyProfileBackground: await getApplyMyProfileImageadoptAssetService('background'),
          }
        : null,
      follow: permissions.follow ? null : null,
      report: permissions.report ? null : null,
      sendMessage: permissions.sendMessage ? null : null,
    },
  }

  return <ProfilePageClient {...profilePageProps} />
}
