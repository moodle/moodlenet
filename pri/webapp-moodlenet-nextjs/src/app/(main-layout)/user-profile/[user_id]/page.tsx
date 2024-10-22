import { redirect } from 'next/navigation'
import { sitepaths } from '../../../../lib/common/utils/sitepaths'
import { primary } from '../../../../lib/server/session-access'
import { params } from '../../../../lib/server/types'
import { Fallback } from '../../../../ui/pages/Fallback/Fallback'

export default async function UserProfilePage({ params: { userId } }: { params: params<'userId'> }) {
  const [found, userProfile] = await primary.moodle.userProfile.userProfile.access({ by: { idOf: 'user', userId } })
  if (!found) {
    return <Fallback />
  }
  const profileInfo = userProfile.accessObject.profileInfo
  redirect(sitepaths.profile[userProfile.accessObject.id]![profileInfo.urlSafeName]!())
}
