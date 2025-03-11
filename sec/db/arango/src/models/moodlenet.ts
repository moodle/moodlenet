import { moodlenet } from '@moodle/domain/model'
import { fromNullable } from 'fp-ts/Option'
import { appDataUserSpaceCollectionData, dbStruct } from '../db-structure'

export function moodlenetImpl({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<moodlenet.MoodlenetModel> {
  return {
    contributor: {
      create: {
        exe:
          () =>
          async ({ record: moodlenet }) => {
            await dbStruct.appData.coll.userSpace.update({ _key: moodlenet.userId }, { moodlenet }, { mergeObjects: false })
          },
      },
      userId: userId => ({
        getData: {
          exe: () => async () => {
            const doc = await dbStruct.appData.coll.userSpace.document({ _key: userId }, { graceful: true })
            return fromNullable(appDataUserCollectionData_2_MoodlenetUserSpace(doc))
          },
        },
      }),
    },
  }
}

function appDataUserCollectionData_2_MoodlenetUserSpace(docData: appDataUserSpaceCollectionData | null): moodlenet.moodlenetContributorView | null {
  return !docData?.moodlenet
    ? null
    : {
        ...docData.moodlenet,
        eduCollection: { items: [] },
        eduResource: { items: [] },
        userProfile: {
          info: docData.userAccount.profile.info,
          avatar: docData.userAccount.profile.avatar,
          background: docData.userAccount.profile.background,
        },
      }
}
