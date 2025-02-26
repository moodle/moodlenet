import { userAccount } from '@moodle/domain/model'
import { none, some } from 'fp-ts/Option'
import { appDataUserCollectionData, dbStruct } from '../db-structure'

export function userAccountImpl({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<userAccount.userAccountModel> {
  return {
    user: {
      '#': _key => ({
        '* create': async ({ spaceData: userAccountUserSpace }, { over, model }) => {
          const { contributorSpace } = await over(model.moodlenet.newUser.emptyContributorSpace).call.query({ userAccountUserSpace })
          const { accessControlUserSpace } = await over(model.accessControl.newUser.emptyContributorSpace).call.query({ userAccountUserSpace })
          await dbStruct.appData.coll.user.save({
            _key,
            userAccount: { user: userAccountUserSpace },
            moodlenet: { contributor: contributorSpace },
            accessControl: { data: accessControlUserSpace },
          })
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

function appDataUserCollectionData_2_UserXspace(docData: appDataUserCollectionData): moo.model.type.xSpaceData<userAccount.userAccountUserSpace> {
  return docData.userAccount.user
}
