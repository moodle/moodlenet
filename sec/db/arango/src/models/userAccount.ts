import { userAccount } from '@moodle/domain/model'
import { fromNullable } from 'fp-ts/Option'
import { dbStruct } from '../db-structure'

export function userAccountImpl({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<userAccount.userAccountModel> {
  return {
    user: {
      '#': _key => ({
        '* create': async ({ spaceData: userAccount }, { over, model }) => {
          const [moodlenet, accessControl, moderation, home] = await Promise.all([
            over(model.moodlenet.contributor).emptyModel.query(),
            over(model.accessControl.user).emptyModel.query(),
            over(model.moderation.userModeration).emptyModel.query(),
            over(model.userHome.userHome).emptyModel.query(),
          ])

          await dbStruct.appData.coll.userAccount.save({
            _key,
            userAccount,
            moodlenet,
            accessControl,
            moderation,
            home,
          })
        },
        '* getData': async () => {
          const doc = await dbStruct.appData.coll.userAccount.document({ _key }, { graceful: true })
          return fromNullable(doc?.userAccount)
        },
      }),
    },
  }
}

