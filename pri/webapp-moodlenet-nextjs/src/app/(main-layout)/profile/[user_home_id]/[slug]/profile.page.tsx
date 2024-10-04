import { priAccess } from '../../../../../lib/server/session-access'
import { params } from '../../../../../lib/server/types'
import { Fallback } from '../../../../../ui/pages/Fallback/Fallback'
import { MainProfileCardDeps } from './components/MainProfileCard'
import ProfileClient from './profile.client'

export default async function ProfilePage({
  params: { user_home_id },
}: {
  params: params<'user_home_id' | 'slug'>
}) {
  const [foundUserHome, userHome] = await priAccess().userHome.read.userHome({
    by: { idOf: 'user_home', user_home_id },
  })
  if (!foundUserHome) {
    return <Fallback />
  }

  const mainProfileCardDeps: MainProfileCardDeps = {
    userHomeAccessObject: userHome.accessObject,
  }
  return <ProfileClient mainProfileCardDeps={mainProfileCardDeps} />
}
