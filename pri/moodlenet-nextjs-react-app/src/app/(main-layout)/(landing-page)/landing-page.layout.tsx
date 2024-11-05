import { access } from '../../../lib/server/session-access'
import { layoutPropsWithChildren, slotsMap } from '../../../lib/server/utils/slots'
import { profileCardProps } from '../../../ui/molecules/ProfileCard/ProfileCard'
import { LandingPageHeader, landingPageHeaderProps } from './landing-page.client'
import './landing-page.style.scss'
import { LandingProfileList } from './LandingProfileList/LandingProfileList'
import { Leaderboard, leaderRowProps } from './Leaderboard/Leaderboard'

export default async function LandingPageLayout(props: layoutPropsWithChildren) {
  const { landingPageData, landingPageLayout, authenticatedUser, moodlenetSiteInfo } =
    await access.primary.moodlenetReactApp.props.landingLayout()

  const { head, content } = slotsMap(props, landingPageLayout.slots)

  const landingPageProps: landingPageProps = {
    authenticatedUser,
    landingPageHeaderProps: {
      headSlotItems: head,
      moodlenetSiteInfo,
    },
    leaderContributors: landingPageData.leaderContributors.map(({ profileInfo, stats, id, slug }) => {
      const leaderRowProps: leaderRowProps = {
        profileInfo,
        profileHomeRoute: `/profile/${id}/${slug}`,
        stats,
      }
      return leaderRowProps
    }),
    suggestedContent: {
      contributors: landingPageData.suggestedContent.contributors.map(({ id, myLinks, profileInfo, slug, stats }) => {
        const profileCardProps: profileCardProps = {
          myLinks,
          profileInfo,
          profileHomeRoute: `/profile/${id}/${slug}`,
          stats,
          actions: { toggleFollow: null },
        }
        return profileCardProps
      }),
    },
  }

  return <LandingPage {...landingPageProps} />
}

type landingPageProps = {
  leaderContributors: leaderRowProps[]
  suggestedContent: {
    contributors: profileCardProps[]
    // eduResources: eduResourceAccessObject[]
    // eduCollections: eduCollectionAccessObject[]
  }
  landingPageHeaderProps: landingPageHeaderProps
  authenticatedUser: boolean
}

function LandingPage({ landingPageHeaderProps, leaderContributors, suggestedContent, authenticatedUser }: landingPageProps) {
  return (
    <div className="landing">
      <LandingPageHeader {...landingPageHeaderProps} />
      {/* <LandingResourceList {...props} />
<LandingCollectionList {...props} />*/}
      <LandingProfileList {...{ authenticatedUser, suggestedContributorList: suggestedContent.contributors }} />
      <Leaderboard {...{ leaderContributors }} />
    </div>
  )
}
