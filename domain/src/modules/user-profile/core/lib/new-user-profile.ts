import { generateNanoId } from '@moodle/lib-id-gen'
import { userAccountRecord } from '../../../user-account'
import { userProfileRecord } from '../../types'

export async function createNewUserProfileData({ newUser }: { newUser: userAccountRecord }): Promise<userProfileRecord> {
  const userProfileId = await generateNanoId()
  const userProfileRecord: userProfileRecord = {
    id: userProfileId,
    userAccount: {
      id: newUser.id,
      roles: newUser.roles,
    },
    eduInterestFields: { iscedFields: [], iscedLevels: [], languages: [], licenses: [] },
    myDrafts: { eduCollections: [], eduResources: [] },
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
