import { home } from '@moodle/domain/model'
import { fromNullable } from 'fp-ts/Option'
import { appDataUserSpaceCollectionData, dbStruct } from '../db-structure'
import { nullish } from '@moodle/lib-types'

export function userHomeImpl({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<home.homeModel> {
  return {
    userHome: {
      create: {
        exe: () => async userHome => {
          await dbStruct.appData.coll.userSpace.update({ _key: userHome.userId }, { home: userHome }, { mergeObjects: false })
        },
      },
      get: {
        exe:
          () =>
          async ({ userId }) => {
            const doc = await dbStruct.appData.coll.userSpace.document({ _key: userId }, { graceful: true })
            return fromNullable(appDataUserCollectionData_2_homeUserView(doc))
          },
      },
    },
  }
}

function appDataUserCollectionData_2_homeUserView(docData: appDataUserSpaceCollectionData | nullish): home.homeUserView | null {
  return !docData?.home
    ? null
    : {
        ...docData.home,
        profile: {
          info: docData.userAccount.profile.info,
          avatar: docData.userAccount.profile.avatar,
          background: docData.userAccount.profile.background,
        },
      }
}
