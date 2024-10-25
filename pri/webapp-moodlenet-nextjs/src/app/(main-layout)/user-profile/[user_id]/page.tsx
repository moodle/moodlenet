import { redirect } from 'next/navigation'
import { sitepaths } from '../../../../lib/common/utils/sitepaths'
import { access } from '../../../../lib/server/session-access'
import { params } from '../../../../lib/server/types'
import { Fallback } from '../../../../ui/pages/Fallback/Fallback'

export default async function UserProfilePage({ params: { userAccountId } }: { params: params<'userAccountId'> }) {
  const [found, userProfileResponse] = await access.primary.userProfile.access.byId({
    by: 'userAccountId',
    userAccountId,
  })
  if (!found) {
    return <Fallback />
  }
  redirect(
    sitepaths.profile[userProfileResponse.accessObject.id]![userProfileResponse.accessObject.appData.urlSafeProfileName]!(),
  )
}
