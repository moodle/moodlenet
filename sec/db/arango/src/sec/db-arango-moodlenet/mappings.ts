import { contributorInfo } from 'domain/src/modules/moodlenet/types/moodlenet-contributor'
import { userProfileDocument, userProfileDocument2userProfileRecord } from '../user-profile-db'

export function userProfileDocument2ContributorInfo(userProfileDocument: userProfileDocument): contributorInfo {
  const {
    id,
    info,
    appData: {
      urlSafeProfileName,
      moodlenet: { points },
    },
  } = userProfileDocument2userProfileRecord(userProfileDocument)

  return {
    profileId: id,
    urlSafeProfileName,
    displayName: info.displayName,
    avatar: info.avatar,
    points: points.amount,
  }
}
