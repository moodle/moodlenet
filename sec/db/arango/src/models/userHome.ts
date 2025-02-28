import { userHome } from '@moodle/domain/model'
import { fromNullable } from 'fp-ts/Option'
import { dbStruct } from '../db-structure'

export function userHomeImpl({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<userHome.userHomeModel> {
  return {
    userHome: {
      _: userId => ({
        $: {
          getData: {
            exe: async () => {
              const doc = await dbStruct.appData.coll.userAccount.document({ _key: userId }, { graceful: true })
              return fromNullable(doc?.home)
            },
          },
        },
      }),
    },
  }
}
