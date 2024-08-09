import { utils } from '@/lib-server/layout'
import Link from 'next/link'
import type { PropsWithChildren } from 'react'
import HeaderSearchbox from './client.header'
import './layout.header.scss'

export default async function LayoutHeader(props: PropsWithChildren) {
  const { slots, ctx } = await utils(props)
  const {
    config: {
      webapp: {
        basePath,
        logo,
        smallLogo,
        labels: { searchPlaceholder },
      },
    },
  } = ctx
  const { center, left, right } = slots(ctx.config.webapp.mainLayout.header.slots)
  return (
    <div className="header">
      <div className="content">
        <div className="left" key="left">
          <Link href={basePath} style={{ textDecoration: 'none' }}>
            <div className="header-title">
              <img className="logo big" src={logo} alt="Logo" />
              <img className="logo small" src={smallLogo} alt="small Logo" />
            </div>
          </Link>
          {left}
        </div>
        <div className="center" key="center">
          <HeaderSearchbox placeholder={searchPlaceholder} />
          {center}
        </div>
        <div className="right" key="right">
          {right}
        </div>
      </div>
    </div>
  )
}
