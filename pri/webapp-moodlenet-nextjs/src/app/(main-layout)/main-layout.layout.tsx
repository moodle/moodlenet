import { LayoutHeaderLogo } from '../../app/_common/header-logo.server'
import { layoutPropsWithChildren, slotsMap } from '../../lib/server/utils/slots'
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
import { userSessionInfo } from '@moodle/mod-iam/lib'
import { sitepaths } from '../../lib/common/utils/sitepaths'
import { priAccess } from '../../lib/server/session-access'
import { logout } from '../actions/access'
import './main-layout.style.scss'

export default async function MainLayoutLayout(props: layoutPropsWithChildren) {
  const [{ userSession }, layouts] = await Promise.all([
    priAccess().iam.session.getCurrentUserSession(),
    priAccess().netWebappNextjs.webapp.layouts(),
  ])
  return (
    <div className={`main-layout`}>
      <MainHeader slots={await headerSlots()} />
      <div className="content">{props.children}</div>
      <Footer slots={footerSlots()} />
    </div>
  )

  async function headerSlots(): Promise<MainHeaderProps['slots']> {
    const { center, left, right } = slotsMap(props, layouts.roots.main.header.slots)
    const defaultLefts = [<LayoutHeaderLogo key="logo" />]
    const defaultCenters = [<HeaderSearchbox key="searchbox" />]
    const { authenticated } = userSessionInfo(userSession)
    const { pages } = sitepaths()
    const avatarUrl = null //user_session.user.avatarUrl
    const userHomeAccessObject =
      authenticated &&
      (await priAccess()
        .userHome.read.userHome({ by: { idOf: 'user', user_id: authenticated.user.id } })
        .then(([userHomeFound, userHomeResult]) => {
          return userHomeFound && userHomeResult.accessObject
        }))

    const baseProfilePages =
      userHomeAccessObject &&
      pages.homepages.profile(userHomeAccessObject.id, userHomeAccessObject.profileInfo.displayName)
    const defaultRights = authenticated
      ? await(async () => {
          return [
            <AvatarMenu
              key="avatar-menu"
              avatarUrl={avatarUrl}
              menuItems={filterOutFalsies([
                baseProfilePages && (
                  <ProfileLink
                    key="profile"
                    avatarUrl={avatarUrl}
                    profileHref={baseProfilePages('')}
                  />
                ),
                baseProfilePages && (
                  <BookmarksLink key="bookmarks" bookmarksHref={baseProfilePages('/bookmarks')} />
                ),
                baseProfilePages && (
                  <FollowingLink key="following" followingHref={baseProfilePages('/followers')} />
                ),
                baseProfilePages && (
                  <UserSettingsLink
                    key="user-settings"
                    settingsHref={pages.user.settings('/general')}
                  />
                ),
                authenticated.isAdmin && (
                  <AdminSettingsLink
                    key="admin-settings"
                    adminHref={pages.admin.settings('/general')}
                  />
                ),
                <Logout key="logout" logout={logout} />,
              ])}
            />,
          ]
        })()
      : [
          <LoginHeaderButton key="login-header-button" />,
          <SignupHeaderButton key="signup-header-button" />,
        ]

    return {
      left: [...defaultLefts, ...left],
      center: [...defaultCenters, ...center],
      right: [...right, ...defaultRights],
    }
  }

  function footerSlots(): FooterProps['slots'] {
    const { center, left, right, bottom } = slotsMap(props, layouts.roots.main.footer.slots)
    return {
      left: [...left],
      center: [...center],
      right: [...right],
      bottom: [...bottom],
    }
  }
}
