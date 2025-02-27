import { accessControl } from '@moodle/domain/model'
import { aql } from 'arangojs'
import { fromNullable, none, some } from 'fp-ts/Option'
import { dbStruct } from '../db-structure'

export function accessControlImpl({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<accessControl.accessControlModel> {
  return {
    user: {
      '#': userId => ({
        '* getData': async () => {
          const doc = await dbStruct.appData.coll.userAccount.document({ _key: userId }, { graceful: true })
          return fromNullable(doc?.accessControl)
        },
        'session': {
          '#': authSessionId => ({
            auth: {
              '* replace': async ({ newData: authSession }) => {
                const cursor = await dbStruct.appData.db.query<true>(
                  aql`
                let doc = DOCUMENT(${dbStruct.appData.coll.userAccount}, ${userId})
                UPDATE doc
                WITH MERGE_RECURSIVE(doc, {
                  accessControl: {
                    session: {
                      auth: {
                        [${authSessionId}] : ${authSession}
                      }
                    }
                  }
                })
                IN ${dbStruct.appData.coll.userAccount}
                RETURN true
                `,
                  { retryOnConflict: 3 },
                )
                const [done] = await cursor.all()
                return done ? some('done') : none
              },
              '* get': async () => {
                const doc = await dbStruct.appData.coll.userAccount.document({ _key: userId }, { graceful: true })
                return fromNullable(doc?.accessControl.session[authSessionId]?.auth)
              },
            },
          }),
        },
      }),
    },
  }
}
