import { ctx, layoutHelper } from '#server/ctx'
import type { PropsWithChildren } from 'react'
import './Footer.scss'

export default async function Footer(props: PropsWithChildren) {
  const { center, left, right, copyright } = (await ctx()).config.webapp.mainLayout.footer.slots
  const { slots } = await layoutHelper(props)
  return (
    <div className="footer">
      <div className="top">
        <div className="left">{slots(left)}</div>
        <div className="center">{slots(center)}</div>
        <div className="right">{slots(right)}</div>
      </div>
      <div className="bottom">
        <div className="bottom">{slots(copyright)}</div>
      </div>
    </div>
  )
}
