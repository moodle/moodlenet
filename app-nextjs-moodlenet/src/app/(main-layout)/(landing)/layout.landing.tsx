import defaultBackground from '@/assets/img/default-landing-background.png'
import { layoutUtils } from '@/lib-server/utils'
import { PropsWithChildren } from 'react'
import { LandingHeadSearchbox, LandingHeadShareButton } from './client.landing'
import './layout.landing.scss'

export default async function LayoutLanding(props: PropsWithChildren) {
  const { slots, ctx } = await layoutUtils(props)
  const {
    website: { subtitle, title, landing },
    permissions,
  } = ctx.session
  const { head, content } = slots(landing.slots)
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
