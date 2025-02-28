import { moderation } from '@moodle/domain/model'
import { fromNullable } from 'fp-ts/Option'
import { appDataUserAccountCollectionData, dbStruct } from '../db-structure'

export function moderationImpl({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<moderation.moderationModel> {
  return {
    userModeration: {
      _: userId => ({
        $: {
          getData: {
            exe: async () => {
              const doc = await dbStruct.appData.coll.userAccount.document({ _key: userId }, { graceful: true })
              return fromNullable(doc && appDataUserCollectionData_2_moderationUserSpace(doc))
            },
          },
        },
      }),
    },
  }
}

function appDataUserCollectionData_2_moderationUserSpace(doc: appDataUserAccountCollectionData): moo.model.type.xSpaceData<moderation.moderationUserSpace> {
  return doc.moderation
}
