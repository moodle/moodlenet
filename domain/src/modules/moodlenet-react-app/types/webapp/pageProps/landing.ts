import { moodlenetContributorInfo, moodlenetContributorMinimalInfo } from '../contributor'

export type landingPageProps = {
  leaderContributors: moodlenetContributorMinimalInfo[]
  suggestedContent: suggestedContent
}
export type suggestedContent = {
  contributors: moodlenetContributorInfo[]
  // eduResources: eduResourceAccessObject[]
  // eduCollections: eduCollectionAccessObject[]
}
