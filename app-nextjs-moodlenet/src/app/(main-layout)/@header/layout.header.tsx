import { utils } from '@/lib-server/layout'
import type { PropsWithChildren } from 'react'
import HeaderSearchbox from './client.header'
import './layout.header.scss'

export default async function LayoutHeader(props: PropsWithChildren) {
  const { slots, ctx } = await utils(props)
  const {
    config: {
      webapp: {
        labels: { searchPlaceholder },
      },
    },
  } = ctx
  const { center, left, right } = slots(ctx.config.webapp.mainLayout.header.slots)
  return (
    <div className="header">
      <div className="content">
        <div className="left" key="left">
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
