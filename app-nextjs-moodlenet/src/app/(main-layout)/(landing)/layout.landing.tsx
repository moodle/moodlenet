import defaultBackground from '@/assets/img/default-landing-background.png'
import { layoutHelper } from '@/lib-server/ctx'
import { PropsWithChildren } from 'react'
import ClientLandingHeaderSearchbox from './client.landing-searchbox'
import './layout.landing.scss'

export default async function LayoutLanding(props: PropsWithChildren) {
  const { slots, ctx } = await layoutHelper(props)
  const { subtitle, title } = ctx.config.webapp
  const { header, content } = slots(ctx.config.webapp.landing.slots)
  const headerStyle = {
    backgroundImage: `url("${defaultBackground.src}")`,
    backgroundSize: 'cover',
  }
  return (
    <div className="landing">
      <div className="landing-header" style={headerStyle}>
        <div className="landing-title">
          <div className="title">{title}</div>
          <div className="subtitle">{subtitle}</div>
        </div>
        <ClientLandingHeaderSearchbox initialSearchText="" placeholder="" />
        {header}
      </div>
      {content}
    </div>
  )
}

async function C() {
  return null
}
