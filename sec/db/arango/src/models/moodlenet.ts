import { moodlenet } from '@moodle/domain/model'
import { fromNullable } from 'fp-ts/Option'
import { appDataUserAccountCollectionData, dbStruct } from '../db-structure'

export function moodlenetImpl({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<moodlenet.MoodlenetModel> {
  return {
    contributor: {
      _: userId => ({
        $: {
          getData: {
            exe: async () => {
              const doc = await dbStruct.appData.coll.userAccount.document({ _key: userId }, { graceful: true })
              return fromNullable(doc && appDataUserCollectionData_2_MoodlenetUserSpace(doc))
            },
          },
        },
      }),
    },
  }
}


function appDataUserCollectionData_2_MoodlenetUserSpace(docData: appDataUserAccountCollectionData): moo.model.type.xSpaceData<moodlenet.moodlenetUserSpace> {
  return {
    ...docData.moodlenet,
    contributor: {
      ...docData.moodlenet.contributor,
      profile: {
        info: docData.userAccount.profile.info,
        avatar: docData.userAccount.profile.avatar,
        background: docData.userAccount.profile.background,
      },
    },
  }
}
