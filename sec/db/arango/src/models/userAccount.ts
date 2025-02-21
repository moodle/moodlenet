import { EMPTY_CONTRIBUTOR_SPACE } from 'domain/src/domain/model/moodlenet.model'
import { userAccountModel, userSpace } from 'domain/src/domain/model/userAccount.model'
import { none, some } from 'fp-ts/Option'
import { appDataUserCollectionData, dbStruct } from '../db-structure'

export function userAccount({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<userAccountModel> {
  return {
    user: {
      '#': _key => ({
        '* create': async ({ spaceData }) => {
          await dbStruct.appData.coll.user.save({ _key, userAccount: { user: spaceData }, moodlenet: { contributor: EMPTY_CONTRIBUTOR_SPACE } })
        },
        '* getData': async () => {
          const doc = await dbStruct.appData.coll.user.document({ _key }, { graceful: true })
          if (!doc) return none
          return some(appDataUserCollectionData_2_UserXspace(doc))
        },
      }),
    },
  }
}

function appDataUserCollectionData_2_UserXspace(docData: appDataUserCollectionData): moo.model.type.xSpaceData<userSpace> {
  return docData.userAccount.user
}
