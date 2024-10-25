import { access } from '../../../lib/server/session-access'
import { getSiteGeneralInfo } from '../../../lib/server/siteGeneralInfo'
import { layoutPropsWithChildren, slotsMap } from '../../../lib/server/utils/slots'
import defaultBackground from '../../../ui/lib/assets/img/default-landing-background.png'
// import { LandingHeadSearchbox, LandingHeadShareButton } from './landing-page.client'
import { LandingHeadSearchbox /* , LandingHeadShareButton  */ } from './landing-page.client'
import './landing-page.style.scss'
import LandingProfileList from './LandingProfileList/LandingProfileList'
import { Leaderboard } from './Leaderboard/Leaderboard'

export default async function LandingPageLayout(props: layoutPropsWithChildren) {
  const [info, layouts] = await Promise.all([getSiteGeneralInfo(), access.primary.moodlenetNextjs.webapp.layouts()])
  const { head, content } = slotsMap(props, layouts.pages.landing.slots)
  const headerStyle = {
    backgroundImage: `url("${defaultBackground.src}")`,
    backgroundSize: 'cover',
  }
  const { pointSystem } = await access.primary.moodlenet.session.moduleInfo()
  const { leaderContributors } = await access.primary.moodlenet.contributor.getLeaders({ amount: 20 })

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
      {/* <LandingResourceList {...props} />
<LandingCollectionList {...props} />*/}
      <LandingProfileList {...props} />
      <Leaderboard {...{ leaderContributors, pointSystem }} />
      {content}
    </div>
  )
}
