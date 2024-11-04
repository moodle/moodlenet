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

import { filterOutFalsies } from '@moodle/lib-types'
import { appRoutes } from '../../lib/common/appRoutes'
import { access } from '../../lib/server/session-access'
import { logout } from '../actions/access'
import './main-layout.style.scss'

export default async function MainLayoutLayout(props: layoutPropsWithChildren) {
  const { mainLayout, session } = await access.primary.moodlenetReactApp.props.mainLayout()
  return (
    <div className={`main-layout`}>
      <MainHeader slots={await prepareHeaderSlots()} />
      <div className="content">{props.children}</div>
      <Footer slots={prepareFooterSlots()} />
    </div>
  )

  async function prepareHeaderSlots(): Promise<MainHeaderProps['slots']> {
    const { center, left, right } = mainLayout.header.slots
    const defaultLefts = [<LayoutHeaderLogo key="logo" />]
    const defaultCenters = [<HeaderSearchbox key="searchbox" />]
    const authenticated = session.type === 'authenticated'

    const avatarAsset = authenticated ? session.userProfileRecord.info.avatar : null
    const defaultRights = authenticated
      ? await(async () => {
          return [
            <AvatarMenu
              key="avatar-menu"
              avatar={avatarAsset}
              menuItems={filterOutFalsies([
                authenticated && (
                  <ProfileLink
                    key="profile"
                    avatar={avatarAsset}
                    profileRoute={`/profile/${session.moodlenetContributorRecord.id}/${session.moodlenetContributorRecord.slug}`}
                  />
                ),
                authenticated && <BookmarksLink key="bookmarks" bookmarksRoute={'/'} />,
                authenticated && <FollowingLink key="following" followingRoute={'/'} />,
                authenticated && <UserSettingsLink key="user-settings" settingsRoute={'/settings'} />,
                authenticated && session.is.admin && <AdminSettingsLink key="admin-settings" adminRoute={'/admin'} />,
                <Logout key="logout" logout={logout} />,
              ])}
            />,
          ]
        })()
      : [
          <LoginHeaderButton loginRoute="/login" key="login-header-button" />,
          <SignupHeaderButton signupRoute="/signup" key="signup-header-button" />,
        ]

    return {
      left: [...defaultLefts, ...left],
      center: [...defaultCenters, ...center],
      right: [...right, ...defaultRights],
    }
  }

  function prepareFooterSlots(): FooterProps['slots'] {
    const { center, left, right, bottom } = mainLayout.footer.slots
    return {
      left: [...left],
      center: [...center],
      right: [...right],
      bottom: [...bottom],
    }
  }
}
