import { accessControl } from '@moodle/domain/model'
import { aql } from 'arangojs'
import { fromNullable } from 'fp-ts/Option'
import { activeAuthSessionData, dbStruct } from '../db-structure'

export function accessControlImpl({ dbStruct }: { dbStruct: dbStruct }): moo.def.model.impl<accessControl.accessControlModel> {
  return {
    user: {
      create: {
        exe:
          () =>
          async ({ record: accessControl }) => {
            await dbStruct.appData.coll.userHome.update({ _key: accessControl.userId }, { accessControl }, { mergeObjects: false })
          },
      },
      createAuthSession: {
        exe: () => async authSession => {
          await dbStruct.services.coll.activeAuthSession.save({ _key: authSession.id, authSession }, { overwriteMode: 'replace' })
        },
      },
      getData: {
        exe: (/*ctx*/) =>
          async ({ userId }) => {
            const doc = await dbStruct.appData.coll.userHome.document({ _key: userId }, { graceful: true })

            const m_userAccessControlView: accessControl.userAccessControlView | undefined = doc?.accessControl && {
              ...doc.accessControl,
              info: {
                displayName: doc.userHome.profile.info.displayName,
                email: doc.userHome.email.address,
              },
            }
            return fromNullable(m_userAccessControlView)
          },
      },
      authSession: {
        get: {
          exe:
            () =>
            async ({ userId, authSessionId }) => {
              const cursor = await dbStruct.services.db.query<activeAuthSessionData>(aql`FOR auth IN ${dbStruct.services.coll.activeAuthSession}
                                                                  FILTER auth.id == ${authSessionId} && auth.userId == ${userId}
                                                                  LIMIT 1
                                                                  RETURN auth`)
              const [m_activeAuthSessionData] = await cursor.all()
              //.document({ _key: userId }, { graceful: true })
              return fromNullable(m_activeAuthSessionData?.authSession)
            },
        },
      },
    },
  }
}
