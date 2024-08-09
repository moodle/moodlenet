import { layoutUtils } from '@/lib-server/layout'
import type { PropsWithChildren } from 'react'
import './layout.footer.scss'

export default async function LayoutFooter(props: PropsWithChildren) {
  const { slots, ctx } = await layoutUtils(props)
  const { center, left, right, copyright } = slots(ctx.session.webapp.mainLayout.footer.slots)
  return (
    <div className="footer">
      <div className="top">
        <div className="left">{left}</div>
        <div className="center">{center}</div>
        <div className="right">{right}</div>
      </div>
      <div className="bottom">
        <div className="bottom">{copyright}</div>
      </div>
    </div>
  )
}
