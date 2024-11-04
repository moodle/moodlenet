import { redirect } from 'next/navigation'
import { appRoutes } from '../../../../../lib/common/appRoutes'
import { access } from '../../../../../lib/server/session-access'
import { params } from '../../../../../lib/server/types'
import { Fallback } from '../../../../../ui/pages/Fallback/Fallback'
import ProfileClient from './ProfilePage/profile.client'

export default async function ProfilePage({
  params: { moodlenetContributorId, slug },
}: {
  params: params<'moodlenetContributorId' | 'slug'>
}) {
  const [foundContributor, profilePageProps] = await access.primary.moodlenetReactApp.props.profilePage({
    moodlenetContributorId,
  })
  if (!foundContributor) {
    return <Fallback />
  }
  const { moodlenetContributorAccessObject } = profilePageProps
  if (moodlenetContributorAccessObject.slug !== slug) {
    redirect(appRoutes(`/profile/${moodlenetContributorId}/${moodlenetContributorAccessObject.slug}`))
  }

  return <ProfileClient {...profilePageProps} />
}
