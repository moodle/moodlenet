import { generateUlid } from '@moodle/lib-id-gen'
import assert from 'assert'
import { isLeft, right } from 'fp-ts/Either'
import * as duration from 'iso8601-duration'
import { isString } from 'lodash'
import { Error4xx } from '../../../lib'
import { applyRolePerms } from './lib/overrideTree'

export const accessControlCore: moo.model.impl = {
  userAccount: {
    userAccountSpace: {
      _: userId => ({
        $: {
          create: {
            post: async (outcome, _message, { model, over }) => {
              if (isLeft(outcome)) {
                return
              }
              const { newUserDefaultRole } = await over(model.configs.module.accessControl).get.query()
              await over(model.accessControl.user[userId]).create.async({
                spaceData: {
                  activeAuthSession: {},
                  auth: {
                    role: newUserDefaultRole,
                  },
                },
              })
            },
          },
        },
      }),
    },
  },
  accessControl: {
    getMyPermissionsInfo: {
      $: {
        call: {
          exe: async (_, { over, model }, ctx) => {
            // NOTICE: remove getMyPermissionsInfo, as it only adds overhead on getTokenPermissionsInfo - initially good for testing origin request info propagation
            // NOTICE:   ... unless there's a sensible use-case for it
            assert(ctx.envelope.origin.gate.kind === 'core', new Error4xx('Expectation Failed', `ctx.envelope.origin.gate.kind === 'core' (${ctx.envelope.origin.gate.kind})`))
            const authSessionToken = ctx.envelope.origin.gate.gateRequest.info.claims.server.authSessionToken
            ctx.log.debug(`gateRequest.info.claims.server authSessionToken: ${authSessionToken}`)
            return over(model.accessControl.getTokenPermissionsInfo).call.query({ authSessionToken })
          },
        },
      },
    },
    getTokenPermissionsInfo: {
      $: {
        call: {
          exe: async ({ authSessionToken }, _) => {
            if (!isString(authSessionToken)) {
              return getAnonPermissionsInfo(_)
            }
            const e_authSessionData = await _.over(_.model.jwtTokens.token.accessControl.authSession.validate).call.query({ token: authSessionToken })
            if (isLeft(e_authSessionData)) {
              throw new Error4xx('Unauthorized', 'invalid token')
            }
            const { authSessionId, userId } = e_authSessionData.right.data
            const e_userPermissionsDeps = await _.over(_.model.accessControl.user[userId]?.getUserPermissionsDepsForAuthSessionId).call.query({ authSessionId })
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
      },
    },
    user: {
      _: userId => ({
        activateNewAuthSession: {
          $: {
            call: {
              exe: async (_, { model, over }, ctx) => {
                const authSessionId = generateUlid({ onDate: new Date() })
                const configs = await over(model.configs.module.accessControl).get.query()
                const expires = duration.end(duration.parse(configs.sessionExpirationTime)).toISOString()

                const { token: authSessionToken } = await over(model.jwtTokens.token.accessControl.authSession.sign).call.query({
                  data: { userId, authSessionId },
                  expires,
                }) // as signed_token

                await over(model.accessControl.user[userId]?.activeAuthSession[authSessionId]?.authSession).put.sync({
                  newData: {
                    expires,
                    envelope: {
                      id: ctx.envelope.id,
                      callTime: ctx.envelope.callTime,
                      origin: ctx.envelope.origin,
                    },
                  },
                })

                return right({ authSessionId, authSessionToken })
              },
            },
          },
        },
      }),
    },
  },
}

async function getAnonPermissionsInfo(_: moo.model.handle): Promise<{ info: moo.permissions.user.info }> {
  const configs = await _.over(_.model.configs.module.accessControl).get.query()

  const anonTree = applyRolePerms(configs.permissionsConfigTree, [configs.roles.anonymous.perm])
  return {
    info: { tree: anonTree, revDate: configs.roles.anonymous.revDate, user: { type: 'anon' } },
  }
}
