import { moderation } from '@moodle/domain/model'
import { fromNullable } from 'fp-ts/Option'
import { dbStruct } from '../db-structure'

export function moderationImpl({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<moderation.moderationModel> {
  return {
    userModeration: {
      _: userId => ({
        $: {
          create: {
            exe: async ({ spaceData: moderation }) => {
              await dbStruct.appData.coll.userSpace.update({ _key: userId }, { moderation }, { mergeObjects: false })
            },
          },
          getData: {
            exe: async () => {
              const doc = await dbStruct.appData.coll.userSpace.document({ _key: userId }, { graceful: true })
              return fromNullable(doc?.moderation)
            },
          },
        },
      }),
    },
  }
}

