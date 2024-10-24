import { access } from '../../../lib/server/session-access'
import { getSiteGeneralInfo } from '../../../lib/server/siteGeneralInfo'
import { layoutPropsWithChildren, slotsMap } from '../../../lib/server/utils/slots'
import defaultBackground from '../../../ui/lib/assets/img/default-landing-background.png'
// import { LandingHeadSearchbox, LandingHeadShareButton } from './landing-page.client'
import { LandingHeadSearchbox /* , LandingHeadShareButton  */ } from './landing-page.client'
import './landing-page.style.scss'

export default async function LandingPageLayout(props: layoutPropsWithChildren) {
  const [info, layouts] = await Promise.all([getSiteGeneralInfo(), access.primary.moodlenetNextjs.webapp.layouts()])

  const { head, content } = slotsMap(props, layouts.pages.landing.slots)
  const { userSession } = await access.primary.userAccount.session.getUserSession()

  const headerStyle = {
    backgroundImage: `url("${defaultBackground.src}")`,
    backgroundSize: 'cover',
  }
  return (
    <div className="landing">
      <div className="landing-header" style={headerStyle}>
        <div className="landing-title">
          <div className="title">{info.moodlenet.title}</div>
          <div className="subtitle">{info.moodlenet.subtitle}</div>
        </div>
        <LandingHeadSearchbox />
        {head}
      </div>
      <pre>{JSON.stringify(userSession, null, 2)}</pre>
      {content}
    </div>
  )
}
