import { profileCardProps } from '../../../ui/molecules/ProfileCard/ProfileCard'
import { LandingHead, landingHeadProps } from './landing.client'
import { LandingProfileList } from './LandingProfileList/LandingProfileList'
import { Leaderboard, leaderRowProps } from './Leaderboard/Leaderboard'

// import { LandingHeadSearchbox, LandingHeadShareButton } from './landing.client'
export type landingProps = {
  leaderContributors: leaderRowProps[]
  suggestedContent: {
    contributors: profileCardProps[]
    // eduResources: eduResourceAccessObject[]
    // eduCollections: eduCollectionAccessObject[]
  }
  landingHeadProps: landingHeadProps
  authenticatedUser: boolean
}

export default async function Landing({ landingHeadProps, leaderContributors, suggestedContent, authenticatedUser }: landingProps) {
  return (
    <div className="landing">
      <LandingHead {...landingHeadProps} />
      {/* <LandingResourceList {...props} />
<LandingCollectionList {...props} />*/}
      <LandingProfileList {...{ authenticatedUser, suggestedContributorList: suggestedContent.contributors }} />
      <Leaderboard {...{ leaderContributors }} />
    </div>
  )
}
