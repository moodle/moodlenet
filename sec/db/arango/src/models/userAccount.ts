import { userAccount } from '@moodle/domain/model'
import { fromNullable } from 'fp-ts/Option'
import { dbStruct } from '../db-structure'

export function userAccountImpl({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<userAccount.userAccountModel> {
  return {
    user: {
      _: userId => ({
        $: {
          create: {
            exe: async ({ spaceData: userAccount }, { over, model }) => {
              const [moodlenet, accessControl, moderation, home] = await Promise.all([
                over(model.moodlenet.contributor).emptySpace.query(),
                over(model.accessControl.user).emptySpace.query(),
                over(model.moderation.userModeration).emptySpace.query(),
                over(model.userHome.userHome).emptySpace.query(),
              ])

              await dbStruct.appData.coll.userAccount.save({
                _key: userId,
                userAccount,
                moodlenet,
                accessControl,
                moderation,
                home,
              })
            },
          },
          getData: {
            exe: async () => {
              const doc = await dbStruct.appData.coll.userAccount.document({ _key: userId }, { graceful: true })
              return fromNullable(doc?.userAccount)
            },
          },
        },
      }),
    },
  }
}

