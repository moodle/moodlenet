import { LayoutHeaderLogo } from '@/app/_common/header-logo.server'
import { sessionContext } from '@/lib/server/sessionContext'
import { layoutPropsWithChildren, slots } from '@/lib/server/utils/slots'
import { isGuest } from '@/lib/server/utils/user'
import Footer, { FooterProps } from '@/ui/organisms/Footer/Footer'
import MainHeader, { MainHeaderProps } from '@/ui/organisms/Header/MainHeader/MainHeader'
import { HeaderSearchbox, LoginHeaderButton, SignupHeaderButton } from './client.layout.main'
import './layout.main.scss'

export default async function LayoutMain(props: layoutPropsWithChildren) {
  const {
    website: { layouts },
    currentUser,
  } = await sessionContext()
  const { footer, header } = await layouts.roots('main')
  const user = await currentUser()

  return (
    <div className={`main-layout`}>
      <MainHeader slots={headerSlots()} />
      <div className="content">{props.children}</div>
      <Footer slots={footerSlots()} />
    </div>
  )

  function headerSlots(): MainHeaderProps['slots'] {
    const { center, left, right } = slots(props, header.slots)
    const defaultLefts = [<LayoutHeaderLogo key="logo" />]
    const defaultCenters = [<HeaderSearchbox key="searchbox" />]
    const defaultRights = isGuest(user)
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
    const { center, left, right, bottom } = slots(props, footer.slots)
    return {
      left: [...left],
      center: [...center],
      right: [...right],
      bottom: [...bottom],
    }
  }
}
