import defaultBackground from '@/assets/img/default-landing-background.png'
import { sessionContext } from '@/lib-server/sessionContext'
import { slots } from '@/lib-server/utils/slots'
import { LandingHeadSearchbox, LandingHeadShareButton } from './client.landing'
import './layout.landing.scss'

export default async function LayoutLanding(props: layoutPropsWithChildren) {
  const { website, permission } = await sessionContext()
  const info = await website.info()
  const layout = await website.layouts.pages('landing')
  const { head, content } = slots(props, layout.slots)
  const headerStyle = {
    backgroundImage: `url("${defaultBackground.src}")`,
    backgroundSize: 'cover',
  }
  const canCreateDraftContent = await permission('createDraftContent')
  return (
    <div className="landing">
      <div className="landing-header" style={headerStyle}>
        <div className="landing-title">
          <div className="title">{info.title}</div>
          <div className="subtitle">{info.subtitle}</div>
        </div>
        <LandingHeadSearchbox defaultValue="" placeholder="" />
        {canCreateDraftContent && <LandingHeadShareButton />}
        {head}
      </div>
      {content}
    </div>
  )
}
