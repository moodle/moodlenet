import { LayoutHeaderLogo } from '@/app/_common/header-logo.server'
import Footer, { FooterProps } from '@/ui/organisms/Footer/Footer'
import { MainHeaderProps } from '@/ui/organisms/Header/MainHeader/MainHeader'
import type { ReactNode } from 'react'
// import { } from './client.layout.simple'
import { sessionContext } from '@/lib/server/sessionContext'
import { layoutPropsWithChildren, slots } from '@/lib/server/utils/slots'
import MinimalisticHeader from '@/ui/organisms/Header/Minimalistic/MinimalisticHeader'
import './simple-layout.style.scss'

export default async function SimpleLayoutLayout(props: layoutPropsWithChildren) {
  const {
    website: { layouts },
  } = await sessionContext()
  const { footer, header } = await layouts.roots('main')

  return (
    <div className={`simple-layout`}>
      <MinimalisticHeader slots={headerSlots()} />
      <div className="content">{props.children}</div>
      <Footer slots={footerSlots()} />
    </div>
  )

  function headerSlots(): MainHeaderProps['slots'] {
    const { center, left, right } = slots(props, header.slots)
    const defaultLefts = [<LayoutHeaderLogo key="logo" />]
    const defaultCenters: ReactNode[] = []
    const defaultRights: ReactNode[] = []

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
