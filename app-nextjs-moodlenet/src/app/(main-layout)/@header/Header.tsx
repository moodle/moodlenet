import { ctx, layoutHelper } from '#server/ctx'
import type { PropsWithChildren } from 'react'
import './Header.scss'

export default async function Header(props: PropsWithChildren) {
  const { center, left, right } = (await ctx()).config.webapp.mainLayout.header.slots
  const { slots } = await layoutHelper(props)
  return (
    <div className="header">
      <div className="content">
        <div className="left" key="left">
          {slots(left)}
        </div>
        <div className="center" key="center">
          {slots(center)}
        </div>
        <div className="right" key="right">
          {slots(right)}
        </div>
      </div>
    </div>
  )
}
