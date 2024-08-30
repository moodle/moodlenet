import { map, mod } from '@moodle/domain'
import { LayoutHeaderLogo } from '../../app/_common/header-logo.server'
import { getAccessProxy } from '../../lib/server/session-access'
import { layoutPropsWithChildren, slotsMap } from '../../lib/server/utils/slots'
import Footer, { FooterProps } from '../../ui/organisms/Footer/Footer'
import MainHeader, { MainHeaderProps } from '../../ui/organisms/Header/MainHeader/MainHeader'
import { HeaderSearchbox, LoginHeaderButton, SignupHeaderButton } from './main-layout.client'

import './main-layout.style.scss'

export default async function MainLayoutLayout(props: layoutPropsWithChildren) {
  const {
    d: {
      modules: {
        moodle: {
          net: {
            V0_1: { pri: mnet },
          },
        },
      },
    },
  } = getAccessProxy()
  const {
    _200: {
      roots: {
        main: { footer, header },
      },
    },
  } = map(mnet.read.layouts(), { _200: r => r })
  await access('net', 'read', 'layouts', void 0).val
  const { user } = await access('iam', 'current-session', 'auth', void 0).val

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
    const defaultRights = mod.moodle.iam.isGuest(user)
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
