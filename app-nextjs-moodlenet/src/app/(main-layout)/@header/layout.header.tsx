import { layoutHelper } from '@/lib-server/ctx'
import type { PropsWithChildren } from 'react'
import './layout.header.scss'

export default async function LayoutHeader(props: PropsWithChildren) {
  const { slots, ctx } = await layoutHelper(props)
  const { center, left, right } = slots(ctx.config.webapp.mainLayout.header.slots)
  return (
    <div className="header">
      <div className="content">
        <div className="left" key="left">
          {left}
        </div>
        <div className="center" key="center">
          {center}
        </div>
        <div className="right" key="right">
          {right}
        </div>
      </div>
    </div>
  )
}
