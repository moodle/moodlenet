import { moodlenet } from '@moodle/domain/model'
import { none, some } from 'fp-ts/Option'
import { appDataUserCollectionData, dbStruct } from '../db-structure'

export function moodlenetImpl({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<moodlenet.MoodlenetModel> {
  return {
    contributor: {
      '#': _key => ({
        '* getData': async () => {
          const doc = await dbStruct.appData.coll.user.document({ _key }, { graceful: true })
          if (!doc) return none
          return some(appDataUserCollectionData_2_ContributorXspace(doc))
        },
      }),
    },
  }
}

function appDataUserCollectionData_2_ContributorXspace(docData: appDataUserCollectionData): moo.model.type.xSpaceData<moodlenet.contributorSpace> {
  return {
    ...docData.moodlenet.contributor,
    profileInfo: docData.userAccount.user.profileInfo,
    images: {
      avatar: docData.userAccount.user.images.avatar,
      background: docData.userAccount.user.images.background,
    },
  }
}
