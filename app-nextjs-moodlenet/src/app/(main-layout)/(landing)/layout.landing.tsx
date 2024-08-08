import { layoutHelper } from '@/lib-server/ctx'
import { PropsWithChildren } from 'react'
import './layout.landing.scss'
// import defaultBackground from '@/assets/img/default-landing-background.png'

export default async function LayoutLanding(props: PropsWithChildren) {
  const { slots, ctx } = await layoutHelper(props)
  const { hero, content } = slots(ctx.config.webapp.mainLayout.landing.slots)

  // prendi da legacy
  return (
    <div>
      <div>{hero}</div>
      <div>{content}</div>
    </div>
  )
}

async function C() {
  return null
}
