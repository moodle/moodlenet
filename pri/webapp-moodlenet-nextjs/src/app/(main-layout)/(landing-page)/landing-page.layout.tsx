import { priAccess } from '../../../lib/server/session-access'
import { layoutPropsWithChildren, slotsMap } from '../../../lib/server/utils/slots'
import defaultBackground from '../../../ui/lib/assets/img/default-landing-background.png'
// import { LandingHeadSearchbox, LandingHeadShareButton } from './landing-page.client'
import { LandingHeadSearchbox /* , LandingHeadShareButton  */ } from './landing-page.client'
import './landing-page.style.scss'

export default async function LandingPageLayout(props: layoutPropsWithChildren) {
  const [moodlenet, layouts] = await Promise.all([
    priAccess().moodle.netWebappNextjs.pri.moodlenet.info(),
    priAccess().moodle.netWebappNextjs.pri.webapp.layouts(),
  ])

  const { head, content } = slotsMap(props, layouts.pages.landing.slots)
  const { userSession } = await priAccess().moodle.iam.pri.session.getCurrentUserSession()

  const headerStyle = {
    backgroundImage: `url("${defaultBackground.src}")`,
    backgroundSize: 'cover',
  }
  return (
    <div className="landing">
      <div className="landing-header" style={headerStyle}>
        <div className="landing-title">
          <div className="title">{moodlenet.moodlenet.title}</div>
          <div className="subtitle">{moodlenet.moodlenet.subtitle}</div>
        </div>
        <LandingHeadSearchbox />
        {head}
      </div>
      <pre>{JSON.stringify(userSession, null, 2)}</pre>
      {content}
    </div>
  )
}
