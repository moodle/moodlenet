import { access } from '../../../lib/server/session-access'
import { getSiteGeneralInfo } from '../../../lib/server/siteGeneralInfo'
import { layoutPropsWithChildren, slotsMap } from '../../../lib/server/utils/slots'
import defaultBackground from '../../../ui/lib/assets/img/default-landing-background.png'
// import { LandingHeadSearchbox, LandingHeadShareButton } from './landing-page.client'
import { LandingHeadSearchbox /* , LandingHeadShareButton  */ } from './landing-page.client'
import './landing-page.style.scss'
import { LandingProfileList, landingProfileListProps } from './LandingProfileList/LandingProfileList'
import { Leaderboard, leaderboardProps } from './Leaderboard/Leaderboard'

export default async function LandingPageLayout(props: layoutPropsWithChildren) {
  const suggestedContent = await access.primary.moodlenet.content.getSuggestedContent()
  const [info, layouts] = await Promise.all([getSiteGeneralInfo(), access.primary.moodlenetReactApp.webapp.layouts()])
  const { head, content } = slotsMap(props, layouts.pages.landing.slots)
  const headerStyle = {
    backgroundImage: `url("${defaultBackground.src}")`,
    backgroundSize: 'cover',
  }
  const { pointSystem } = await access.primary.moodlenet.session.moduleInfo()
  const { leaderContributors } = await access.primary.moodlenet.contributor.getLeaders({ amount: 20 })

  const leaderboardProps: leaderboardProps = { leaderContributors, pointSystem }

  const landingProfileListProps: landingProfileListProps = {
    profilesPropsList: [],
    areCurrentUserSuggestions: false,
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
      {/* <LandingResourceList {...props} />
<LandingCollectionList {...props} />*/}
      <LandingProfileList {...landingProfileListProps} />
      <Leaderboard {...leaderboardProps} />
      {content}
    </div>
  )
}
