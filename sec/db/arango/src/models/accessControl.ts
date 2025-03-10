import { accessControl } from '@moodle/domain/model'
import { fromNullable } from 'fp-ts/Option'
import { dbStruct } from '../db-structure'

export function accessControlImpl({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<accessControl.accessControlModel> {
  return {
    user: {
      _: userId => ({
        $: {
          create: {
            exe: async ({ spaceData: accessControl }) => {
              await dbStruct.appData.coll.userSpace.update({ _key: userId }, { accessControl }, { mergeObjects: false })
            },
          },
          getData: {
            exe: async () => {
              const doc = await dbStruct.appData.coll.userSpace.document({ _key: userId }, { graceful: true })

              const _: moo.model.ops.xSpaceData<accessControl.accessControlUserSpace> | undefined = doc?.accessControl && {
                ...doc.accessControl,
                info: {
                  displayName: doc.userAccount.profile.info.displayName,
                  email: doc.userAccount.email.address,
                },
              }

              return fromNullable(_)
            },
          },
        },
        activeAuthSession: {
          _: authSessionId => ({
            $: {
              create: {
                exe: async ({ spaceData }) => {
                  await dbStruct.appData.coll.userSpace.update(
                    { _key: userId },
                    {
                      accessControl: {
                        activeAuthSession: {
                          [authSessionId]: spaceData,
                        },
                      },
                    },
                    { mergeObjects: false },
                  )
                },
              },
            },
            auth: {
              $: {
                get: {
                  exe: async () => {
                    const doc = await dbStruct.appData.coll.userSpace.document({ _key: userId }, { graceful: true })
                    return fromNullable(doc?.accessControl?.activeAuthSession[authSessionId]?.authSession)
                  },
                },
              },
            },
          }),
        },
      }),
    },
  }
}
