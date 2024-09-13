import { LayoutHeaderLogo } from '../../app/_common/header-logo.server'
import { layoutPropsWithChildren, slotsMap } from '../../lib/server/utils/slots'
import Footer, { FooterProps } from '../../ui/organisms/Footer/Footer'
import MainHeader, { MainHeaderProps } from '../../ui/organisms/Header/MainHeader/MainHeader'
import { HeaderSearchbox, LoginHeaderButton, SignupHeaderButton } from './main-layout.client'

import { lib_moodle_iam } from '@moodle/lib-domain'
import { getMod } from '../../lib/server/session-access'
import './main-layout.style.scss'

export default async function MainLayoutLayout(props: layoutPropsWithChildren) {
  const {
    moodle: {
      // iam: {
      //   v0_1: { pri: priIam },
      // },
      netWebappNextjs: {
        v0_1: { pri: priApp },
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
  ///////////////##############################/////////////////////////////
  ///////////////##############################/////////////////////////////
  ///////////////##############################/////////////////////////////
  // await iam.userSession.current()
  // await app.userSession.current() and it uses iam ?  <= better
  const { user } = { user: { type: 'guest' } as const }
  ///////////////##############################/////////////////////////////
  ///////////////##############################/////////////////////////////
  ///////////////##############################/////////////////////////////
  return (
    <div className={`main-layout`}>
      <MainHeader slots={headerSlots()} />
      <div className="content">{props.children}</div>
      <Footer slots={footerSlots()} />
    </div>
  )

  function headerSlots(): MainHeaderProps['slots'] {
    const { center, left, right } = slotsMap(props, header.slots)
    const defaultLefts = [<LayoutHeaderLogo key="logo" />]
    const defaultCenters = [<HeaderSearchbox key="searchbox" />]
    const defaultRights = lib_moodle_iam.v0_1.isGuestSession(user)
      ? [
          <LoginHeaderButton key="login-header-button" />,
          <SignupHeaderButton key="signup-header-button" />,
        ]
      : []

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
