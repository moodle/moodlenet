import { generateUlid } from '@moodle/lib-id-gen'
import { isLeft, right } from 'fp-ts/Either'
import * as duration from 'iso8601-duration'
import { isString } from 'lodash'
import { Error4xx } from '../../../lib'
import { applyRolePerms } from './lib/applyRolePerms'
import { isNone } from 'fp-ts/Option'

export const accessControlCore: moo.model.impl = {
  userAccount: {
    create: {
      post:
        ({ model }) =>
        async (outcome, { record: { userId } }) => {
          if (isLeft(outcome)) {
            return
          }
          const { data: newUserDefaultRole } = await model.statics.data.type.get.query({ kind: 'configs', ns: 'accessControl', type: 'newUserDefaultRole' })
          await model.accessControl.user.create.async({
            record: {
              userId,
              role: newUserDefaultRole,
            },
          })
        },
    },
  },
  accessControl: {
    getTokenPermissionsInfo: {
      exe:
        ({ model }) =>
        async ({ authSessionToken }) => {
          if (!isString(authSessionToken)) {
            return getAnonPermissionsInfo(model)
          }
          const e_authSessionData = await model.jwtTokens.validate.query({ ns: 'accessControl', type: 'authSession', token: authSessionToken })
          if (isLeft(e_authSessionData)) {
            throw new Error4xx('Unauthorized', 'invalid token')
          }
          const { authSessionId, userId } = e_authSessionData.right.data
          const o_userPermissionsDeps = await model.accessControl.user.getPermissionsDeps.query({ authSessionId, userId })
          if (isNone(o_userPermissionsDeps)) {
            throw new Error4xx('Expectation Failed', 'unexistent user')
          }
          const { roleConfigs, /*  userRole, */ authSessionIdExists, permissionsConfigTree } = o_userPermissionsDeps.value.deps

          if (!authSessionIdExists) {
            throw new Error4xx('Forbidden', 'invalidated session')
          }

          // if (!roleConfigs) {
          //   throw new Error4xx('Expectation Failed', `no role configs for role: ${userRole}`)
          // }

          const roleTree = applyRolePerms(permissionsConfigTree, [roleConfigs.perm])
          return {
            info: {
              tree: roleTree,
              revDate: roleConfigs.revDate,
              user: {
                type: 'auth',
                id: userId,
              },
            },
          }
        },
    },
    user: {
      activateNewAuthSession: {
        exe:
          ({ model, envelope }) =>
          async ({ userId }) => {
            const authSessionId = generateUlid({ onDate: new Date() })
            const { data: sessionExpirationTime } = await model.statics.data.type.get.query({ kind: 'configs', ns: 'accessControl', type: 'sessionExpirationTime' })
            const expires = duration.end(duration.parse(sessionExpirationTime)).toISOString()

            const { token: authSessionToken } = await model.jwtTokens.sign.query({
              ns: 'accessControl',
              type: 'authSession',
              data: { userId, authSessionId },
              expires,
            }) // as signed_token

            await model.accessControl.user.authSession.put.sync({
              authSession: {
                id: authSessionId,
                userId,
                expires,
                envelope: {
                  id: envelope.id,
                  callTime: envelope.callTime,
                  origin: envelope.origin,
                },
              },
            })

            return right({ authSessionId, authSessionToken })
          },
      },
    },
  },
}

async function getAnonPermissionsInfo(model: moo.model.handle): Promise<{ info: moo.permissions.user.info }> {
  const { data: configs } = await model.statics.data.ns.get.query({ kind: 'configs', ns: 'accessControl' })

  const anonTree = applyRolePerms(configs.permissionsConfigTree, [configs.roles.anonymous.perm])
  return {
    info: { tree: anonTree, revDate: configs.roles.anonymous.revDate, user: { type: 'anon' } },
  }
}
