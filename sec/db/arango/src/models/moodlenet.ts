import { moodlenet } from '@moodle/domain/model'
import { fromNullable } from 'fp-ts/Option'
import { appDataUserHomeCollectionData, dbStruct } from '../db-structure'

export function moodlenetImpl({ dbStruct }: { dbStruct: dbStruct }): moo.def.model.impl<moodlenet.MoodlenetModel> {
  return {
    contributor: {
      create: {
        exe:
          () =>
          async ({ record: moodlenet }) => {
            await dbStruct.appData.coll.userHome.update({ _key: moodlenet.userId }, { moodlenet }, { mergeObjects: false })
          },
      },
      userId: userId => ({
        getData: {
          exe: () => async () => {
            const doc = await dbStruct.appData.coll.userHome.document({ _key: userId }, { graceful: true })
            return fromNullable(appDataUserCollectionData_2_MoodlenetUserHome(doc))
          },
        },
      }),
    },
  }
}

function appDataUserCollectionData_2_MoodlenetUserHome(docData: appDataUserHomeCollectionData | null): moodlenet.moodlenetContributorView | null {
  return !docData?.moodlenet
    ? null
    : {
        ...docData.moodlenet,
        eduCollection: { items: [] },
        eduResource: { items: [] },
        userProfile: {
          info: docData.userHome.profile.info,
          avatar: docData.userHome.profile.avatar,
          background: docData.userHome.profile.background,
        },
      }
}
