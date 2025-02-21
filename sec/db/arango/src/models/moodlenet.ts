import { contributorSpace, MoodlenetModel } from 'domain/src/domain/model/moodlenet.model'
import { none, some } from 'fp-ts/Option'
import { appDataUserCollectionData, dbStruct } from '../db-structure'

export function userAccount({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<MoodlenetModel> {
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

function appDataUserCollectionData_2_ContributorXspace(docData: appDataUserCollectionData): moo.model.type.xSpaceData<contributorSpace> {
  return {
    ...docData.moodlenet.contributor,
    profileInfo: docData.userAccount.user.profileInfo,
    images: {
      avatar: docData.userAccount.user.images.avatar,
      background: docData.userAccount.user.images.background,
    },
  }
}
