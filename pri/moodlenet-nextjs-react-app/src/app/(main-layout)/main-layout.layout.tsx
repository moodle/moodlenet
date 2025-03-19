import { LayoutHeaderLogo } from '../../app/_common/header-logo.server'
import { layoutPropsWithChildren } from '../../lib/server/utils/slots'
import { Footer, FooterProps } from '../../ui/organisms/Footer/Footer'
import { MainHeader, MainHeaderProps } from '../../ui/organisms/Header/MainHeader/MainHeader'
import {
  AdminSettingsLink,
  AvatarMenu,
  BookmarksLink,
  FollowingLink,
  HeaderSearchbox,
  LoginHeaderButton,
  Logout,
  ProfileLink,
  SignupHeaderButton,
  UserSettingsLink,
} from './main-layout.client'

import { filterOutFalsies, webSlug } from '@moodle/lib-types'
import { logout } from '../actions/access'
import './main-layout.style.scss'
import session from '../../lib/server/session-client'

export default async function MainLayoutLayout(props: layoutPropsWithChildren) {
  const my = await client.my

  const authenticated = my.permissionsInfo.user.type === 'auth'
  const myInfo = await my.gate.authenticated.mySpace.curateMyProfile.info.read().send?.()

  return (
    <div className={`main-layout`}>
      <MainHeader slots={await prepareHeaderSlots()} />
      <div className="content">{props.children}</div>
      <Footer slots={prepareFooterSlots()} />
    </div>
  )

  async function prepareHeaderSlots(): Promise<MainHeaderProps['slots']> {
    // const { center, left, right } = mainLayout.header.slots
    const defaultLefts = [<LayoutHeaderLogo key="logo" />]
    const defaultCenters = [<HeaderSearchbox key="searchbox" />]
    const defaultRights = myInfo
      ? [
          <AvatarMenu
            key="avatar-menu"
            avatar={myInfo.profile.avatar}
            menuItems={filterOutFalsies([
              authenticated && <ProfileLink key="profile" avatar={myInfo.profile.avatar} profileRoute={`/profile/${myInfo.userId}/${webSlug(myInfo.profile.info.displayName)}`} />,
              authenticated && <BookmarksLink key="bookmarks" bookmarksRoute={'/'} />,
              authenticated && <FollowingLink key="following" followingRoute={'/'} />,
              authenticated && <UserSettingsLink key="user-settings" settingsRoute={'/settings'} />,
              authenticated && my.permissionsInfo.tree.admin && <AdminSettingsLink key="admin-settings" adminRoute={'/admin'} />,
              <Logout key="logout" logout={logout} />,
            ])}
          />,
        ]
      : [<LoginHeaderButton loginRoute="/login" key="login-header-button" />, <SignupHeaderButton signupRoute="/signup" key="signup-header-button" />]

    return {
      left: [...defaultLefts /* , ...left */],
      center: [...defaultCenters /* , ...center */],
      right: [/* ...right,  */ ...defaultRights],
    }
  }

  function prepareFooterSlots(): FooterProps['slots'] {
    // const { center, left, right, bottom } = mainLayout.footer.slots
    return {
      left: [
        /* ...left */
      ],
      center: [
        /* ...center */
      ],
      right: [
        /* ...right */
      ],
      bottom: [
        /* ...bottom */
      ],
    }
  }
}
