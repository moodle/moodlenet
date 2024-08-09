import defaultBackground from '@/assets/img/default-landing-background.png'
import { utils } from '@/lib-server/layout'
import { PropsWithChildren } from 'react'
import { LandingHeadSearchbox, LandingHeadShareButton } from './client.landing'
import './layout.landing.scss'

export default async function LayoutLanding(props: PropsWithChildren) {
  const { slots, ctx } = await utils(props)
  const {
    subtitle,
    title,
    user: { permissions },
  } = ctx.config.webapp
  const { head, content } = slots(ctx.config.webapp.landing.slots)
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
        <LandingHeadSearchbox defaultValue="" placeholder="" />
        {permissions.createDraftContent && <LandingHeadShareButton />}
        {head}
      </div>
      {content}
    </div>
  )
}
