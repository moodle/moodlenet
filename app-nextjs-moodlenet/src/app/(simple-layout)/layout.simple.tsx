import { LayoutHeaderLogo } from '@/_common/header-logo.server'
import type { ReactNode } from 'react'
import Footer, { FooterProps } from 'ui-cmps/organisms/Footer/Footer'
import { MainHeaderProps } from 'ui-cmps/organisms/Header/MainHeader/MainHeader'
// import { } from './client.layout.simple'
import { sessionContext } from '@/lib-server/sessionContext'
import { layoutPropsWithChildren, slots } from '@/lib-server/utils/slots'
import MinimalisticHeader from 'ui-cmps/organisms/Header/Minimalistic/MinimalisticHeader'
import './layout.simple.scss'

export default async function LayoutSimple(props: layoutPropsWithChildren) {
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
