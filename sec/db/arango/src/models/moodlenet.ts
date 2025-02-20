import { contributorSpace, MoodlenetModel } from 'domain/src/domain/model/moodlenet.model'
import { none, some } from 'fp-ts/Option'
import { dbStruct } from '../db-structure'

export function userAccount({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<MoodlenetModel> {
  return {
    contributor: {
      '#': _key => ({
        '* getData': async () => {
          const doc = await dbStruct.appData.coll.user.document({ _key }, { graceful: true })
          if (!doc) return none
          return some<moo.model.type.xSpaceData<contributorSpace>>({
            ...doc.moodlenet.contributor,
            profileInfo: doc.userAccount.user.profileInfo,
            images: {
              avatar: doc.userAccount.user.images.avatar,
              background: doc.userAccount.user.images.background,
            },
          })
        },
      }),
    },
  }
}
