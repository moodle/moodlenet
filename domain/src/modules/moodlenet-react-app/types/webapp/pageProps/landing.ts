import { moodlenetSiteInfo } from '../../../../moodlenet/types'
import { PageLayouts } from '../../layouts/page'
import { webappContributorAccessData } from './profile'

export type landingPageData = {
  leaderContributors: webappContributorAccessData[]
  suggestedContent: suggestedContent
}
export type suggestedContent = {
  contributors: webappContributorAccessData[]
  // eduResources: eduResourceAccessObject[]
  // eduCollections: eduCollectionAccessObject[]
}

export type landingLayoutProps = {
  landingPageLayout: PageLayouts['landing']
  landingPageData: landingPageData
  authenticatedUser: boolean
  moodlenetSiteInfo: moodlenetSiteInfo
}
