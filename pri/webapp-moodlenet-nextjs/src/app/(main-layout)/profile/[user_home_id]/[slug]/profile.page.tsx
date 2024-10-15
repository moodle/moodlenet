import { assetRecord2asset, priAccess } from '../../../../../lib/server/session-access'
import { params } from '../../../../../lib/server/types'
import { Fallback } from '../../../../../ui/pages/Fallback/Fallback'
import { mainProfileCardProps } from './components/MainProfileCard'
import ProfileClient from './profile.client'

export default async function ProfilePage({
  params: { user_home_id },
}: {
  params: params<'user_home_id' | 'slug'>
}) {
  const [foundUserHome, userHome] = await priAccess().userHome.userHome.access({
    by: { idOf: 'user_home', user_home_id },
  })
  if (!foundUserHome) {
    return <Fallback />
  }

  const mainProfileCardDeps: mainProfileCardProps = {
    userHome: {
      ...userHome.accessObject,
      avatar:
        userHome.accessObject.avatar &&
        (await assetRecord2asset(userHome.accessObject.avatar).userHome[
          user_home_id
        ]!.profile.avatar()),
      background:
        userHome.accessObject.background &&
        (await assetRecord2asset(userHome.accessObject.background).userHome[
          user_home_id
        ]!.profile.background()),
    },
  }

  return <ProfileClient mainProfileCardDeps={mainProfileCardDeps} />
}
