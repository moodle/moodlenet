import { generateUlid } from '@moodle/lib-id-gen'
import { isLeft, right } from 'fp-ts/Either'
import * as duration from 'iso8601-duration'
import { isString } from 'lodash'
import { Error4xx } from '../../../lib'
import { applyRolePerms } from './lib/applyRolePerms'

export const accessControlCore: moo.model.impl = {
  userAccount: {
    user: {
      create: {
        post: async (outcome, { record: { userId } }, { model }) => {
          if (isLeft(outcome)) {
            return
          }
          const { newUserDefaultRole } = await model.configs.model.accessControl.get.query()
          await model.accessControl.user.create.async({
            record: {
              userId,
              role: newUserDefaultRole,
            },
          })
        },
      },
    },
  },
  accessControl: {
    getTokenPermissionsInfo: {
      exe: async ({ authSessionToken }, { model }) => {
        if (!isString(authSessionToken)) {
          return getAnonPermissionsInfo(model)
        }
        const e_authSessionData = await model.jwtTokens.model.accessControl.authSession.validate.query({ token: authSessionToken })
        if (isLeft(e_authSessionData)) {
          throw new Error4xx('Unauthorized', 'invalid token')
        }
        const { authSessionId, userId } = e_authSessionData.right.data
        const e_userPermissionsDeps = await model.accessControl.getPermissionsDeps.query({ authSessionId, userId })
        if (isLeft(e_userPermissionsDeps)) {
          throw new Error4xx('Expectation Failed', 'unexistent user')
        }
        const { roleConfigs, /*  userRole, */ authSessionIdExists, permissionsConfigTree } = e_userPermissionsDeps.right.deps

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
    activateNewAuthSession: {
      exe: async ({ userId }, { model, envelope }) => {
        const authSessionId = generateUlid({ onDate: new Date() })
        const configs = await model.configs.model.accessControl.get.query()
        const expires = duration.end(duration.parse(configs.sessionExpirationTime)).toISOString()

        const { token: authSessionToken } = await model.jwtTokens.model.accessControl.authSession.sign.query({
          data: { userId, authSessionId },
          expires,
        }) // as signed_token

        await model.accessControl.user.authSession.create.sync({
          record: {
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
}

async function getAnonPermissionsInfo(model: moo.model.handle): Promise<{ info: moo.permissions.user.info }> {
  const configs = await model.configs.model.accessControl.get.query()

  const anonTree = applyRolePerms(configs.permissionsConfigTree, [configs.roles.anonymous.perm])
  return {
    info: { tree: anonTree, revDate: configs.roles.anonymous.revDate, user: { type: 'anon' } },
  }
}
