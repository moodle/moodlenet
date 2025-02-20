import { EMPTY_CONTRIBUTOR_SPACE } from 'domain/src/domain/model/moodlenet.model'
import { userAccountModel } from 'domain/src/domain/model/userAccount.model'
import { dbStruct } from '../db-structure'

export function userAccount({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<userAccountModel> {
  return {
    user: {
      '#': _key => ({
        '* create': async ({ spaceData }) => {
          await dbStruct.appData.coll.user.save({ _key, userAccount: { user: spaceData }, moodlenet: { contributor: EMPTY_CONTRIBUTOR_SPACE } })
        },
      }),
    },
  }
}
