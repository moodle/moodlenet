import { redirect } from 'next/navigation'
import { sitepaths } from '../../../../lib/common/utils/sitepaths'
import { primary } from '../../../../lib/server/session-access'
import { params } from '../../../../lib/server/types'
import { Fallback } from '../../../../ui/pages/Fallback/Fallback'

export default async function UserProfilePage({ params: { userAccountId } }: { params: params<'userAccountId'> }) {
  const [found, userProfileResponse] = await primary.moodle.userProfile.userProfile.access({
    by: 'userAccountId',
    userAccountId,
  })
  if (!found) {
    return <Fallback />
  }
  redirect(sitepaths.profile[userProfileResponse.accessObject.id]![userProfileResponse.accessObject.urlSafeProfileName]!())
}
