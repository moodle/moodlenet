import { moodlenetContributorAccessObject } from '../../../../moodlenet/types'

export type webappContributorAccessData = moodlenetContributorAccessObject & {
  slug: string
}
