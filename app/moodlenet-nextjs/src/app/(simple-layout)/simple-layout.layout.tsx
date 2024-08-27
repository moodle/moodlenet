import type { ReactNode } from 'react'
import { LayoutHeaderLogo } from '../../app/_common/header-logo.server'
import Footer, { FooterProps } from '../../ui/organisms/Footer/Footer'
import { MainHeaderProps } from '../../ui/organisms/Header/MainHeader/MainHeader'
// import { } from './client.layout.simple'
import { getAccess } from '../../lib/server/sessionContext'
import { layoutPropsWithChildren, slotsMap } from '../../lib/server/utils/slots'
import MinimalisticHeader from '../../ui/organisms/Header/Minimalistic/MinimalisticHeader'
import './simple-layout.style.scss'

export default async function SimpleLayoutLayout(props: layoutPropsWithChildren) {
  const access = await getAccess()
  const {
    layouts: {
      roots: {
        main: { header, footer },
      },
    },
  } = await access('net', 'read', 'layouts', void 0).val

  return (
    <div className={`simple-layout`}>
      <MinimalisticHeader slots={headerSlots()} />
      <div className="content">{props.children}</div>
      <Footer slots={footerSlots()} />
    </div>
  )

  function headerSlots(): MainHeaderProps['slots'] {
    const { center, left, right } = slotsMap(props, header.slots)
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
    const { center, left, right, bottom } = slotsMap(props, footer.slots)
    return {
      left: [...left],
      center: [...center],
      right: [...right],
      bottom: [...bottom],
    }
  }
}
