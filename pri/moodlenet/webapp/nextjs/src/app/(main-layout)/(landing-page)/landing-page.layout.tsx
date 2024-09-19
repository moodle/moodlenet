import { getMod, getUserSession } from '../../../lib/server/session-access'
import { layoutPropsWithChildren, slotsMap } from '../../../lib/server/utils/slots'
import defaultBackground from '../../../ui/lib/assets/img/default-landing-background.png'
// import { LandingHeadSearchbox, LandingHeadShareButton } from './landing-page.client'
import { LandingHeadSearchbox /* , LandingHeadShareButton  */ } from './landing-page.client'
import './landing-page.style.scss'

export default async function LandingPageLayout(props: layoutPropsWithChildren) {
  const app = getMod().moodle.netWebappNextjs.v1_0.pri
  const configs = await app.configs.read()
  const landing = configs.nextjs.layouts.pages.landing
  const { info } = configs.net
  const { head, content } = slotsMap(props, landing.slots)
  const userSession = await getUserSession()

  const headerStyle = {
    backgroundImage: `url("${defaultBackground.src}")`,
    backgroundSize: 'cover',
  }
  return (
    <div className="landing">
      <div className="landing-header" style={headerStyle}>
        <div className="landing-title">
          <div className="title">{info.title}</div>
          <div className="subtitle">{info.subtitle}</div>
        </div>
        <LandingHeadSearchbox />
        {/* canCreateDraftContent && <LandingHeadShareButton /> */}
        {head}
      </div>
      <pre>{JSON.stringify(userSession, null, 2)}</pre>
      {content}
    </div>
  )
}
