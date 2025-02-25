import { moodlenet, userAccount } from '@moodle/domain/model'
import { none, some } from 'fp-ts/Option'
import { appDataUserCollectionData, dbStruct } from '../db-structure'

export function userAccountImpl({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<userAccount.userAccountModel> {
  return {
    user: {
      '#': _key => ({
        '* create': async ({ spaceData }) => {
          await dbStruct.appData.coll.user.save({ _key, userAccount: { user: spaceData }, moodlenet: { contributor: moodlenet.EMPTY_CONTRIBUTOR_SPACE } })
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

function appDataUserCollectionData_2_UserXspace(docData: appDataUserCollectionData): moo.model.type.xSpaceData<userAccount.userSpace> {
  return docData.userAccount.user
}
