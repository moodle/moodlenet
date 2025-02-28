import { generateUlid } from '@moodle/lib-id-gen'
import { int } from '@moodle/lib-types'
import { isLeft, left, right } from 'fp-ts/Either'
import { isNone } from 'fp-ts/Option'
import { isString } from 'lodash'
import { NOT_FOUND } from '../../lib'
import { authSession } from '../model/accessControl.model'
import { domainCore } from '../persona'
import { admin } from '../persona/admin.persona/admin.persona.core'
import { anonymous } from '../persona/anonymous.persona/anonymous.persona.core'
import { any } from '../persona/any.persona/any.persona.core'
import { authenticated } from '../persona/authenticated.persona/authenticated.persona.core'
import { moderator } from '../persona/moderator.persona/moderator.persona.core'

export const domainCoreImpl: domainCore = {
  admin,
  anonymous,
  any,
  authenticated,
  moderator,
}

export const coreModelImpl: moo.model.impl = {
  moodlenet: {
    contributor: {
      $: {
        emptySpace: {
          exe: async () => {
            return { contributor: { points: int(0) } }
          },
        },
      },
    },
  },
  moderation: {
    userModeration: {
      $: {
        emptySpace: {
          exe: async () => {
            return {
              reports: { received: { moodlenet: {} } },
            }
          },
        },
      },
    },
  },
  accessControl: {
    user: {
      $: {
        emptySpace: {
          exe: async () => {
            return {
              session: {},
              permissions: { role: 'viewer' },
            }
          },
        },
      },
    },
    getMyUserSessionInfo: {
      $: {
        call: {
          exe: async ({ authSessionToken }, _) => {
            if (!isString(authSessionToken)) {
              return getAnonSessionInfo(_)
            }
            const e_authSessionData = await _.over(_.model.jwtTokens.xModel.accessControl.authSession.validate).call.query({ token: authSessionToken })
            if (isLeft(e_authSessionData)) {
              return getAnonSessionInfo(_)
            }
            const { authSessionId, userId } = e_authSessionData.right.data
            const o_authSession = await _.over(_.model.accessControl.user[userId]?.session[authSessionId]?.auth).get.query()
            if (isNone(o_authSession)) {
              return getAnonSessionInfo(_)
            }
            const authSession = o_authSession.value
            return {
              info: {
                session: authSession.session,
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
    //     user:{
    //       _:(userId)=>({
    // activeSession:{
    //   '#' : (authSessionId)=>({
    //     "* create": async ({spaceData: {authSession}},{model,over})=>{
    //       await over(model.accessControl.storeAuthSession).call.sync({authSessionId,activeAuthSession})
    //     }
    //   })
    // }
    //       } )
    //     }
    getUserSessionFor: {
      $: {
        call: {
          exe: async ({ userId }, { model, over }) => {
            const o_permissions = await over(model.accessControl.user[userId]?.permissions).get.query()
            if (isNone(o_permissions)) {
              return left(NOT_FOUND)
            }
            const { role } = o_permissions.value
            const { fullUserSession } = await getFullUserSession({ over, model })
            const session: moo.session.user = {
              admin: role === 'admin' ? fullUserSession.admin : undefined,
              moderator: role === 'admin' ? fullUserSession.moderator : undefined,
              anonymous: undefined,
              any: fullUserSession.any,
              authenticated: {
                ...fullUserSession.authenticated,
                messaging: {
                  email: {
                    ...fullUserSession.authenticated.messaging.email,
                    send: role === 'contributor' ? fullUserSession.authenticated.messaging.email.send : undefined,
                  },
                },
                moodlenet: {
                  ...fullUserSession.authenticated.moodlenet,
                  contribute: undefined,
                },
              },
            }
            return right({ session })
          },
        },
      },
    },
    getAnonUserSession: {
      $: {
        call: {
          exe: async (_void, _) => {
            const {
              fullUserSession: { anonymous, any },
            } = await getFullUserSession(_)
            const session: moo.session.user = {
              any,
              anonymous,
            }
            return {
              session,
            }
          },
        },
      },
    },
    activateAuthSessionFor: {
      $: {
        call: {
          exe: async ({ userId }, _) => {
            const e_session_obj = await _.over(_.model.accessControl.getUserSessionFor).call.query({
              userId,
            })
            if (isLeft(e_session_obj)) {
              return e_session_obj
            }

            const { session } = e_session_obj.right

            const authSessionId = generateUlid({ onDate: new Date() })
            const { token: authSessionToken } = await _.over(_.model.jwtTokens.xModel.accessControl.authSession.sign).call.query({ data: { userId, authSessionId } }) // as signed_token

            const authSession: authSession = {
              session,
              createdDate: new Date().toISOString(),
              validUntilDate: new Date().toISOString(),
            }

            await _.over(_.model.accessControl.user[userId]?.session[authSessionId]?.auth).put.sync({ newData: authSession })

            return right({ authSession, authSessionId, authSessionToken })
          },
        },
      },
    },
  },
}

async function getAnonSessionInfo(_: moo.model.handle): Promise<{ info: moo.session.user.info }> {
  const user: moo.session.user.info.user = { type: 'anon' }
  const { session: anonSession } = await _.over(_.model.accessControl.getAnonUserSession).call.query()
  return {
    info: {
      user,
      session: anonSession,
    },
  }
}

async function getFullUserSession({ over, model }: moo.model.handle): Promise<{ fullUserSession: moo.session.config }> {
  const { org, userAccount: _userAccount, moodlenet, education: _education } = await over(model.configs.allConfigs).call.query()
  // userAccount.configs.schema.eduDraftsOverrides
  // education.configs.schema.collection
  const fullUserSession: moo.session.config = {
    admin: {
      _: { schemas: { orgInfo: org.schema.orgInfo } },
      moodlenet: {
        curateInfo: { general: { edit: {}, read: {} } },
      },
      organization: {
        curateInfo: {
          general: {
            edit: {},
            read: {},
          },
        },
      },
      userBase: {
        managePermissions: {
          edit: {
            role: {},
          },
          searchUsers: {
            byText: {},
          },
        },
      },
    },
    anonymous: {
      access: {
        login: {
          resetMyPassword: {
            requestLink: {},
            setNew: {},
          },
          withMyEmailAndPassword: { login: {} },
        },
        signup: { withMyEmail: { confirmMyEmail: {}, submitSignupForm: {} } },
      },
    },
    any: {
      _: { schemas: { baseUserData: org.schema.baseUserData, general: org.schema.general } },
      moodlenet: {
        viewPublicContent: {
          entity: { collection: {}, contributor: {}, resource: {}, subject: {} },
          followers: { collection: {}, subject: {}, contributor: {} },
          fullTextSearch: { collections: {}, contributors: {}, resources: {}, subjects: {} },
        },
      },
      system: { access: { session: { myOwn: {} } } },
    },
    authenticated: {
      _: {
        schemas: {
          //FIXME: eduDraftsPublishOverrides should go in authenticated.moodlenet.contribute[moo.configs] scope
          eduDraftsPublishOverrides: moodlenet.schema.publishEduOverrides,
        },
      },
      edu: { curatePreferences: { categories: { edit: {}, read: {} } } },
      messaging: { email: { preferences: { edit: {}, read: {} }, send: { user: {} } } },
      moodlenet: {
        contribute: { publishMyContent: { collection: {}, resource: {} } },
        curatePreferences: { search: { edit: {}, read: {} } },
        curateContent: {
          bookmark: { collection: {}, resource: {} },
          follow: { collection: {}, contributor: {}, subject: {} },
          like: { resource: {} },
          report: { contributor: {} },
        },
        exchangeWithLms: { resources: { send: {} } },
      },
      myAccount: { manage: { deleteIt: { confirmDelete: {}, request: {} } }, security: { authentication: { changeMyPassword: {} } } },
      mySpace: {
        curateMyDrafts: {
          collection: { create: {}, read: {}, edit: {}, setBackground: {}, trash: {} },
          resource: { create: {}, read: {}, edit: {}, setBackground: {}, trash: {} },
        },
        curateMyProfile: { info: { edit: {}, setBackground: {}, read: {}, setAvatar: {} } },
      },
    },
    moderator: { moodlenet: { manageReports: { contributors: { ignoreReports: {}, viewList: {} } } } },
  }
  return { fullUserSession }
}
