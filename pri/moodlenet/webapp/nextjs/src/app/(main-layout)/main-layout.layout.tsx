import { LayoutHeaderLogo } from '../../app/_common/header-logo.server'
import { layoutPropsWithChildren, slotsMap } from '../../lib/server/utils/slots'
import { Footer, FooterProps } from '../../ui/organisms/Footer/Footer'
import { MainHeader, MainHeaderProps } from '../../ui/organisms/Header/MainHeader/MainHeader'
import {
  AvatarMenu,
  HeaderSearchbox,
  LoginHeaderButton,
  SignupHeaderButton,
} from './main-layout.client'

import { lib_moodle_iam } from '@moodle/lib-domain'
import { getMod, getUserSession } from '../../lib/server/session-access'
import './main-layout.style.scss'
import { user_session } from 'lib/domain/src/moodle/iam/v1_0'
import { sitepaths } from '../../lib/common/utils/sitepaths'
import { logout } from '../actions/session'

export default async function MainLayoutLayout(props: layoutPropsWithChildren) {
  const {
    moodle: {
      netWebappNextjs: {
        v1_0: { pri: priApp },
      },
    },
  } = getMod()
  const {
    nextjs: {
      layouts: {
        roots: {
          main: { footer, header },
        },
      },
    },
  } = await priApp.configs.read()
  const user_session = await getUserSession()
  return (
    <div className={`main-layout`}>
      <MainHeader slots={headerSlots(user_session)} />
      <div className="content">{props.children}</div>
      <Footer slots={footerSlots()} />
    </div>
  )

  function headerSlots(user_session: user_session): MainHeaderProps['slots'] {
    const { center, left, right } = slotsMap(props, header.slots)
    const defaultLefts = [<LayoutHeaderLogo key="logo" />]
    const defaultCenters = [<HeaderSearchbox key="searchbox" />]
    const isAuthenticated = lib_moodle_iam.v1_0.isAuthenticated(user_session)
    const isAdmin = lib_moodle_iam.v1_0.hasUserRole(user_session, 'admin')
    const { pages } = sitepaths()
    const defaultRights = isAuthenticated
      ? [
          <AvatarMenu
            key="avatar-menu"
            {...{
              adminSettingsLinkProps: isAdmin && { adminHref: pages.admin() },
              bookmarksLinkProps: {
                bookmarksHref: `pages.homepages.profile('bookmarks') `,
              },
              followingLinkProps: {
                followingHref: `pages.homepages.profile('following') `,
              },
              logoutProps: {
                logout,
              },
              profileLinkProps: {
                avatarUrl: null,
                profileHref: `pages.homepages.profile('settings') `,
              },
              userSettingsLinkProps: {
                settingsHref: `pages.homepages.profile() `,
              },
            }}
          />,
        ]
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
    const { center, left, right, bottom } = slotsMap(props, footer.slots)
    return {
      left: [...left],
      center: [...center],
      right: [...right],
      bottom: [...bottom],
    }
  }
}
