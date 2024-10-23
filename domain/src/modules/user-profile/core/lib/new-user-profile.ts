import { generateNanoId } from '@moodle/lib-id-gen'
import { webSlug } from '@moodle/lib-types'
import { baseContext } from '../../../../types'
import { newUserProfileMoodlenetData } from '../../../net/core/lib/new-user'
import { userAccountRecord } from '../../../user-account'
import { userProfileRecord } from '../../types'

export async function createNewUserProfileData({
  newUser,
  ctx,
}: {
  newUser: userAccountRecord
  ctx: baseContext
}): Promise<userProfileRecord> {
  const userProfileId = await generateNanoId()
  const userProfileRecord: userProfileRecord = {
    id: userProfileId,
    userAccountUser: {
      id: newUser.id,
      roles: newUser.roles,
    },
    appData: {
      urlSafeProfileName: webSlug(newUser.displayName),
      moodlenet: await newUserProfileMoodlenetData({ ctx }),
    },
    eduInterestFields: { iscedFields: [], iscedLevels: [], languages: [], licenses: [] },
    myDrafts: { eduResourceCollections: [], eduResources: [] },
    info: {
      displayName: newUser.displayName,
      aboutMe: '',
      location: '',
      siteUrl: null,
      avatar: null,
      background: null,
    },
  }
  return userProfileRecord
}
