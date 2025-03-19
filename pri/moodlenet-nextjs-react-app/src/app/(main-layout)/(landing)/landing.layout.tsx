import session from '../../../lib/server/session-client'
import { layoutPropsWithChildren } from '../../../lib/server/utils/slots'
import { profileCardProps } from '../../../ui/molecules/ProfileCard/ProfileCard'
import Landing, { landingProps } from './landing.page'
import './landing.style.scss'
import { leaderRowProps } from './Leaderboard/Leaderboard'

export default async function LandingLayout(props: layoutPropsWithChildren) {
  // const { landingPageData, authenticatedUser, platformInfo /* , landingPageLayout */ } = await client.proxy.moodlenetReactApp.props.landingLayout()
  const platformInfo = (await session.client.my).gate.authenticated.myAccount.security.authentication.changeMyPassword()
  // const { head, content } = slotsMap(props, landingPageLayout.slots)

  const landingProps: landingProps = {
    authenticatedUser,
    landingHeadProps: {
      // headSlotItems: head,
      platformInfo,
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

  return <Landing {...landingProps} />
}
