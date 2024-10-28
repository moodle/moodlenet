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
import { userSessionInfo } from '@moodle/module/user-account/lib'
import { sitepaths } from '../../lib/common/utils/sitepaths'
import { access } from '../../lib/server/session-access'
import { logout } from '../actions/access'
import './main-layout.style.scss'

export default async function MainLayoutLayout(props: layoutPropsWithChildren) {
  const [{ session }, layouts] = await Promise.all([
    access.primary.moodlenetReactApp.session.getWebappGlobalCtx(),
    access.primary.moodlenetReactApp.session.layouts(),
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
    const authenticated = session.type === 'authenticated'

    const avatarAsset = authenticated ? session.userProfileRecord.info.avatar : null
    const baseProfilePage = authenticated
      ? sitepaths.profile[session.moodlenetContributorRecord.id]![session.moodlenetContributorRecord.slug]!
      : null
    const defaultRights = authenticated
      ? await(async () => {
          return [
            <AvatarMenu
              key="avatar-menu"
              avatar={avatarAsset}
              menuItems={filterOutFalsies([
                baseProfilePage && <ProfileLink key="profile" avatar={avatarAsset} profileHref={baseProfilePage()} />,
                baseProfilePage && <BookmarksLink key="bookmarks" bookmarksHref={baseProfilePage.bookmarks()} />,
                baseProfilePage && <FollowingLink key="following" followingHref={baseProfilePage.followers()} />,
                baseProfilePage && <UserSettingsLink key="user-settings" settingsHref={sitepaths.settings.general()} />,
                authenticated && session.is.admin && (
                  <AdminSettingsLink key="admin-settings" adminHref={sitepaths.admin.general()} />
                ),
                <Logout key="logout" logout={logout} />,
              ])}
            />,
          ]
        })()
      : [<LoginHeaderButton key="login-header-button" />, <SignupHeaderButton key="signup-header-button" />]

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
