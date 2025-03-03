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
              return fromNullable(doc?.accessControl)
            },
          },
        },
        session: {
          _: authSessionId => ({
            $: {
              create: {
                exe: async ({ spaceData }) => {
                  await dbStruct.appData.coll.userSpace.update(
                    { _key: userId },
                    {
                      accessControl: {
                        session: {
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
                    return fromNullable(doc?.accessControl?.session[authSessionId]?.auth)
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
