import { userAccount } from '@moodle/domain/model'
import { fromNullable } from 'fp-ts/Option'
import { dbStruct } from '../db-structure'

export function userAccountImpl({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<userAccount.userAccount> {
  return {
    userAccountSpace: {
      _: userId => ({
        $: {
          create: {
            exe: async ({ spaceData: userAccount }) => {
              await dbStruct.appData.coll.userSpace.save({
                _key: userId,
                userAccount,
              })
            },
          },
          getData: {
            exe: async () => {
              const doc = await dbStruct.appData.coll.userSpace.document({ _key: userId }, { graceful: true })
              return fromNullable(doc?.userAccount)
            },
          },
        },
      }),
    },
  }
}

