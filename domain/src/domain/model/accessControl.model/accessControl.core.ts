import { generateUlid } from '@moodle/lib-id-gen'
import { isLeft, right } from 'fp-ts/Either'
import * as duration from 'iso8601-duration'
import { isString } from 'lodash'
import { Error4xx } from '../../../lib'
import { applyRolePolicies } from './lib/applyRolePolicies'
import { isNone } from 'fp-ts/Option'

export const accessControlCore: moo.def.model.impl = {
  userHome: {
    create: {
      post:
        ({ model }) =>
        async (outcome, { userHomeRecord: { userId } }) => {
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
    getTokenPoliciesInfo: {
      exe:
        ({ model }) =>
        async ({ authSessionToken }) => {
          if (!isString(authSessionToken)) {
            return getAnonPoliciesInfo(model)
          }
          const e_authSessionData = await model.signedTokens.validate.query({ ns: 'accessControl', type: 'authSession', token: authSessionToken })
          if (isLeft(e_authSessionData)) {
            throw new Error4xx('Unauthorized', 'invalid token')
          }
          const { authSessionId, userId } = e_authSessionData.right.data
          const o_userPoliciesDeps = await model.accessControl.user.getPoliciesDeps.query({ authSessionId, userId })
          if (isNone(o_userPoliciesDeps)) {
            throw new Error4xx('Expectation Failed', 'unexistent user')
          }
          const { roleConfigs, /*  userRole, */ authSessionIdExists, policiesConfigTree } = o_userPoliciesDeps.value.deps

          if (!authSessionIdExists) {
            throw new Error4xx('Forbidden', 'invalidated session')
          }

          // if (!roleConfigs) {
          //   throw new Error4xx('Expectation Failed', `no role configs for role: ${userRole}`)
          // }

          const roleTree = applyRolePolicies(policiesConfigTree, [roleConfigs.perm])
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

            const { token: authSessionToken } = await model.signedTokens.sign.query({
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

async function getAnonPoliciesInfo(model: moo.def.model.handle): Promise<{ info: moo.def.policies.user.info }> {
  const { data: configs } = await model.statics.data.ns.get.query({ kind: 'configs', ns: 'accessControl' })

  const anonTree = applyRolePolicies(configs.policiesConfigTree, [configs.roles.anonymous.perm])
  return {
    info: { tree: anonTree, revDate: configs.roles.anonymous.revDate, user: { type: 'anon' } },
  }
}
