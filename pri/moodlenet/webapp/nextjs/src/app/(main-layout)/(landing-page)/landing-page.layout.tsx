import defaultBackground from '../../../assets/img/default-landing-background.png'
import { getMod, getUserSession } from '../../../lib/server/session-access'
import { layoutPropsWithChildren, slotsMap } from '../../../lib/server/utils/slots'
// import { LandingHeadSearchbox, LandingHeadShareButton } from './landing-page.client'
import { LandingHeadSearchbox /* , LandingHeadShareButton  */ } from './landing-page.client'
import './landing-page.style.scss'

export default async function LandingPageLayout(props: layoutPropsWithChildren) {
  const {
    moodle: {
      netWebappNextjs: {
        v1_0: { pri: app },
      },
    },
  } = getMod()
  const {
    nextjs: {
      layouts: {
        pages: { landing },
      },
    },
    net: { info },
  } = await app.configs.read()

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
        <LandingHeadSearchbox defaultValue="" placeholder="" />
        {/* canCreateDraftContent && <LandingHeadShareButton /> */}
        {head}
      </div>
      <pre>{JSON.stringify(userSession, null, 2)}</pre>
      {content}
    </div>
  )
}
