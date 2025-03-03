import { moodlenet } from '@moodle/domain/model'
import { fromNullable } from 'fp-ts/Option'
import { appDataUserSpaceCollectionData, dbStruct } from '../db-structure'

export function moodlenetImpl({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<moodlenet.MoodlenetModel> {
  return {
    contributor: {
      _: userId => ({
        $: {
          create: {
            exe: async ({ spaceData: moodlenet }) => {
              await dbStruct.appData.coll.userSpace.update({ _key: userId }, { moodlenet }, { mergeObjects: false })
            },
          },
          getData: {
            exe: async () => {
              const doc = await dbStruct.appData.coll.userSpace.document({ _key: userId }, { graceful: true })
              return fromNullable(appDataUserCollectionData_2_MoodlenetUserSpace(doc))
            },
          },
        },
      }),
    },
  }
}

function appDataUserCollectionData_2_MoodlenetUserSpace(docData: appDataUserSpaceCollectionData | null): moo.model.type.xSpaceData<moodlenet.moodlenetUserSpace> | null {
  return !docData?.moodlenet
    ? null
    : {
        ...docData.moodlenet,
        contributor: {
          ...docData.moodlenet.contributor,
          userProfile: {
            info: docData.userAccount.profile.info,
            avatar: docData.userAccount.profile.avatar,
            background: docData.userAccount.profile.background,
          },
        },
      }
}
