import { moderation } from '@moodle/domain/model'
import { fromNullable } from 'fp-ts/Option'
import { dbStruct } from '../db-structure'

export function moderationImpl({ dbStruct }: { dbStruct: dbStruct }): moo.def.model.impl<moderation.moderationModel> {
  return {
    user: {
      create: {
        exe: () => async userModerationSpace => {
          await dbStruct.appData.coll.userHome.update({ _key: userModerationSpace.userId }, { moderation: userModerationSpace }, { mergeObjects: false })
        },
      },
      get: {
        exe:
          () =>
          async ({ userId }) => {
            const doc = await dbStruct.appData.coll.userHome.document({ _key: userId }, { graceful: true })
            return fromNullable(doc?.moderation)
          },
      },
    },
  }
}

