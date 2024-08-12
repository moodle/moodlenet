import { LayoutHeaderLogo } from '@/_common/header-logo.server'
import Footer, { FooterProps } from '@/components/organisms/Footer/Footer'
import { MainHeaderProps } from '@/components/organisms/Header/MainHeader/MainHeader'
import { layoutUtils } from '@/lib-server/utils'
import type { PropsWithChildren } from 'react'
// import { } from './client.layout.simple'
import MinimalisticHeader from '@/components/organisms/Header/Minimalistic/MinimalisticHeader'
import './layout.simple.scss'

export default async function LayoutSimple(props: PropsWithChildren) {
  const {
    ctx: {
      session: {
        website: {
          layout: { main: mainLayout },
        },
      },
    },
    slots,
  } = await layoutUtils(props)
  const headerSlots = ((): MainHeaderProps['slots'] => {
    const { center, left, right } = slots(mainLayout.header.slots)
    return {
      left: [<LayoutHeaderLogo key="logo" />, ...left],
      center: [...center],
      right: [...right],
    }
  })()
  const footerSlots = ((): FooterProps['slots'] => {
    const { center, left, right, bottom } = slots(mainLayout.footer.slots)
    return {
      left: [...left],
      center: [...center],
      right: [...right],
      bottom: [...bottom],
    }
  })()
  return (
    <div className={`main-layout`}>
      <MinimalisticHeader slots={headerSlots} />
      <div className="content">{props.children}</div>
      <Footer slots={footerSlots} />
    </div>
  )
}
