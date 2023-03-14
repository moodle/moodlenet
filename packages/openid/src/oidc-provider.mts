import { instanceDomain } from '@moodlenet/core'
import { verifyWebUserToken } from '@moodlenet/react-app/server'
import Provider, { AdapterPayload, Configuration, interactionPolicy } from 'oidc-provider'
const savedInteractions: Record<
  string,
  {
    id: string
    payload: AdapterPayload
    expiresIn: number
  }
> = {}
// const Provider = o as any as typeof o.default
async function getProviderConfig() {
  const config: Configuration = {
    // ... see the available options in Configuration options section
    clients: [
      {
        client_id: 'clid',
        client_secret: 'secret',
        redirect_uris: ['http://localhost:3000/oauth2/redirect'],
        // + other client properties
      },
    ],
    claims: {
      openid: ['scope', 'isAdmin', 'webUserKey', 'accountId', 'exp', 'iss', 'aud'],
    },
    // async findAccount(ctx, sub, token) {
    //   console.log(`OAUTH findAccount()`, { ctx, sub, token })
    //   if (!token) {
    //     return
    //   }
    //   token
    //   const webUser = await verifyWebUserToken(token)
    //   const Account: Account = {}
    // },
    scopes: ['openid' /* , 'full-user' */],
    routes: {
      authorization: '/../../.oauth/auth',
      // revocation: '/../../.oauth/token/revocation',
      // jwks: '/../../.oauth/jwks',
      // registration: '/../../.oauth/reg',
      // end_session: '/../../.oauth/session/end',
      // token: '/../../.oauth/token',
      // pushed_authorization_request: '/../../.oauth/request',
      // userinfo: '/../../.oauth/me',
      // backchannel_authentication: '/../../.oauth/backchannel_authentication',
      // code_verification: '/../../.oauth/code_verification',
      // device_authorization: '/../../.oauth/device_authorization',
      // introspection: '/../../.oauth/introspection',
    },
    // cookies: { keys: ['sdaijsdajijiosadjiosdaoji'] },
    interactions: {
      // url(_ctx, interaction) {
      //   console.log('interaction', interaction)
      //   return `/login?interaction=${interaction.uid}`
      // },
      // url(_ctx, interaction) {
      //   console.log('interaction', interaction)
      //   return `/.oauth/interaction/${interaction.uid}`
      // },
      policy: [
        new interactionPolicy.Prompt(
          { name: 'consent', requestable: true },
          ...[
            'no_session',
            'max_age',
            'id_token_hint',
            'claims_id_token_sub_value',
            'essential_acrs',
            'essential_acr',
            'native_client_prompt',
            'op_scopes_missing',
            'op_claims_missing',
            'rs_scopes_missing',
          ].map(_ => new interactionPolicy.Check(_, `${_} ccc`, `${_} appap`, () => true)),
        ),
        new interactionPolicy.Prompt(
          { name: 'login', requestable: true },
          ...[
            'no_session',
            'max_age',
            'id_token_hint',
            'claims_id_token_sub_value',
            'essential_acrs',
            'essential_acr',
            'native_client_prompt',
            'op_scopes_missing',
            'op_claims_missing',
            'rs_scopes_missing',
          ].map(_ => new interactionPolicy.Check(_, `${_} ccc`, `${_} appap`, () => true)),
        ),
      ],
    },
    adapter(name) {
      return {
        async revokeByGrantId(...args) {
          console.log(`OAUTH ADAPTER ${name}: revokeByGrantId()`, ...args)
          return
        },
        async consume(...args) {
          console.log(`OAUTH ADAPTER ${name}: consume()`, ...args)
          return
        },
        async destroy(...args) {
          console.log(`OAUTH ADAPTER ${name}: destroy()`, ...args)
          return
        },
        async find(interactionId) {
          const webUser = await verifyWebUserToken(interactionId)
          // if (!(webUser && !webUser.isRoot)) {
          //   return
          // }
          // const resp: AdapterPayload = {
          //   scope: 'openid',
          //   accountId: webUser.profileKey,
          //   iat: webUser.iat,
          //   aud: webUser.aud === undefined || webUser.aud === null ? undefined : [webUser.aud].flat(),
          //   exp: webUser.exp,
          //   iss: webUser.iss,
          //   jti: webUser.jti,
          //   nbf: webUser.nbf,
          //   sub: webUser.sub,
          // }
          // const resp1: AdapterPayload = {
          //   ...webUser,
          //   // accountId: webUser.accountId,
          //   aud:
          //     webUser.aud === undefined || webUser.aud === null ? undefined : [webUser.aud].flat(),
          // }
          // console.log({ webUser, resp1 })
          // return resp1
          const found = savedInteractions[interactionId]?.payload
          console.log(`OAUTH ADAPTER ${name}: find()`, { found, interactionId, webUser })
          return found
        },
        async findByUid(...args) {
          console.log(`OAUTH ADAPTER ${name}: findByUid()`, ...args)
          return
        },
        async findByUserCode(...args) {
          console.log(`OAUTH ADAPTER ${name}: findByUserCode()`, ...args)
          return
        },
        async upsert(id, payload, expiresIn) {
          console.log(`OAUTH ADAPTER ${name}: upsert()`, { id, payload, expiresIn })
          const interaction = {
            id,
            payload: { ...payload, session: { accountId: '737' } },
            expiresIn,
          }
          savedInteractions[id] = interaction
          return
        },
      }
    },

    features: {
      revocation: { enabled: true },
      registration: { enabled: true },
      clientCredentials: { enabled: true },
      introspection: { enabled: true },
      devInteractions: { enabled: true },
      // deviceFlow: { enabled: true },
    },
    issueRefreshToken() {
      return true
    },
    responseTypes: [
      'code id_token token',
      'code id_token',
      'code token',
      'code',
      'id_token token',
      'id_token',
      'none',
    ],
    pkce: { required: () => false, methods: ['S256', 'plain'] },
  }
  return config
}
//export const provider = new Provider('http://issuerdomain.com', configuration)
export async function getOidcProvider() {
  const provider = new Provider(instanceDomain, await getProviderConfig())

  provider.use((ctx, next) => {
    const orig_path = ctx.path
    if (ctx.request.url === '/') {
      ctx.path = '/.well-known/openid-configuration'
    } else if (!ctx.path.startsWith('/interaction')) {
      // } else {
      ctx.path = `/../../.oauth${ctx.path}`
    } else {
      ctx.path = ctx.path.replace(/^\/.oauth/, '')
    }
    console.log(
      ctx.request.method,
      ctx.request.url,
      ':',
      orig_path,
      '->',
      ctx.path /* inspect({ ctx }, true, 10, true) */,
    )
    // setTimeout(() => {
    // console.log(orig_path, '->', ctx.path, inspect({ ctx }, true, 10, true))
    // }, 1000)
    return next()
    // if (ctx.path !== '/oauth-authorization-server') {
    //   return next()
    // }

    // ctx.path = '/openid-configuration'
    // return next().then(() => {
    //   ctx.path = '/oauth-authorization-server'
    // })
  })

  return provider
}
