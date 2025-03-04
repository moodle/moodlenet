import { generateUlid } from '@moodle/lib-id-gen'
import assert from 'assert'
import { isLeft, right } from 'fp-ts/Either'
import * as duration from 'iso8601-duration'
import { isString } from 'lodash'
import { Error4xx } from '../../../lib'

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
            const { roleConfigs, userRole, authSessionIdExists } = e_userPermissionsDeps.right.deps

            if (!authSessionIdExists) {
              throw new Error4xx('Forbidden', 'invalidated session')
            }

            if (!roleConfigs) {
              throw new Error4xx('Expectation Failed', `no role configs for role: ${userRole}`)
            }

            return {
              info: {
                tree: roleConfigs.permissionsTree,
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
        // getPermissionsInfo: {
        //   $: {
        //     call: {
        //       exe: async (_, { over, model }) => {
        //         const e_userPermissionsDeps = await over(model.accessControl.user[userId]?.getUserPermissionsDepsForAuthSessionId).call.query({ authSessionId })
        //         if (isLeft(e_userPermissionsDeps)) {
        //           throw new Error4xx('Expectation Failed', 'unexistent user')
        //         }
        //         const { roleConfigs, userRole, authSessionIdExists } = e_userPermissionsDeps.right.deps

        //         if (!authSessionIdExists) {
        //           throw new Error4xx('Forbidden', 'invalidated session')
        //         }

        //         if (!roleConfigs) {
        //           throw new Error4xx('Expectation Failed', `no role configs for role: ${userRole}`)
        //         }

        //         return {
        //           info: {
        //             tree: roleConfigs.permissionsTree,
        //             revDate: roleConfigs.revDate,
        //             user: {
        //               type: 'auth',
        //               id: userId,
        //             },
        //           },
        //         }
        //       },
        //     },
        //   },
        // },
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
    // __getUserSessionFor: {
    //   $: {
    //     call: {
    //       exe: async ({ userId }, _) => {
    //         const o_permissions = await over(model.accessControl.user[userId]?.permissions).get.query()
    //         if (isNone(o_permissions)) {
    //           return left(NOT_FOUND)
    //         }
    //         const { role } = o_permissions.value
    //         const { fullUserSession } = await getFullUserSession({ over, model })
    //         const session: moo.permissions.user.tree = {
    //           admin: role === 'admin' ? fullUserSession.admin : undefined,
    //           moderator: role === 'admin' ? fullUserSession.moderator : undefined,
    //           anonymous: undefined,
    //           any: fullUserSession.any,
    //           authenticated: {
    //             ...fullUserSession.authenticated,
    //             messaging: {
    //               email: {
    //                 ...fullUserSession.authenticated.messaging.email,
    //                 send: role === 'contributor' ? fullUserSession.authenticated.messaging.email.send : undefined,
    //               },
    //             },
    //             moodlenet: {
    //               ...fullUserSession.authenticated.moodlenet,
    //               contribute: undefined,
    //             },
    //           },
    //         }
    //         return right({ session })
    //       },
    //     },
    //   },
    // },
  },
}

async function getAnonPermissionsInfo(_: moo.model.handle): Promise<{ info: moo.permissions.user.info }> {
  const configs = await _.over(_.model.configs.module.accessControl).get.query()
  return {
    info: { tree: configs.roles.anonymous.permissionsTree, revDate: configs.roles.anonymous.revDate, user: { type: 'anon' } },
  }
}
