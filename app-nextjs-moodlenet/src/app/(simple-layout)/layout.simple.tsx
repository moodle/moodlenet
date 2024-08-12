import { LayoutHeaderLogo } from '@/_common/header-logo.server'
import Footer, { FooterProps } from '@/components/organisms/Footer/Footer'
import { MainHeaderProps } from '@/components/organisms/Header/MainHeader/MainHeader'
import type { PropsWithChildren, ReactNode } from 'react'
// import { } from './client.layout.simple'
import MinimalisticHeader from '@/components/organisms/Header/Minimalistic/MinimalisticHeader'
import { sessionContext } from '@/lib-server/sessionContext'
import { slots } from '@/lib-server/utils/slots'
import './layout.simple.scss'

export default async function LayoutSimple(props: PropsWithChildren) {
  const {
    website: { layouts },
  } = await sessionContext()
  const { footer, header } = await layouts.roots('main')

  return (
    <div className={`main-layout`}>
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
