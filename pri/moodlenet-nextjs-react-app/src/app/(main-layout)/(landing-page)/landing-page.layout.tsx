import { access } from '../../../lib/server/session-access'
import { layoutPropsWithChildren, slotsMap } from '../../../lib/server/utils/slots'
import { LandingPageHeader } from './landing-page.client'
import { LandingProfileList } from './LandingProfileList/LandingProfileList'
import { Leaderboard } from './Leaderboard/Leaderboard'

export default async function LandingPageLayout(props: layoutPropsWithChildren) {
  const landingPageLayoutProps = await access.primary.moodlenetReactApp.props.landingLayout()

  const { head, content } = slotsMap(props, landingPageLayoutProps.landingPageLayout.slots)

  return (
    <div className="landing">
      <LandingPageHeader {...{ headSlotItems: head }} />
      {/* <LandingResourceList {...props} />
<LandingCollectionList {...props} />*/}
      <LandingProfileList
        {...{ suggestedContributorList: landingPageLayoutProps.landingPageProps.suggestedContent.contributors }}
      />
      <Leaderboard {...{ leaderContributors: landingPageLayoutProps.landingPageProps.leaderContributors }} />
      {content}
    </div>
  )
}
