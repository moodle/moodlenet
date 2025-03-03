import { home } from '@moodle/domain/model'
import { fromNullable } from 'fp-ts/Option'
import { dbStruct } from '../db-structure'

export function userHomeImpl({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<home.homeModel> {
  return {
    userHome: {
      _: userId => ({
        $: {
          create: {
            exe: async ({ spaceData: home }) => {
              await dbStruct.appData.coll.userSpace.update({ _key: userId }, { home }, { mergeObjects: false })
            },
          },
          getData: {
            exe: async () => {
              const doc = await dbStruct.appData.coll.userSpace.document({ _key: userId }, { graceful: true })
              return fromNullable(doc?.home)
            },
          },
        },
      }),
    },
  }
}
