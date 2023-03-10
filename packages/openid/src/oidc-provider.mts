import { instanceDomain } from '@moodlenet/core'
import { verifyWebUserToken } from '@moodlenet/react-app/server'
import Provider, { AdapterPayload, Configuration } from 'oidc-provider'
import { inspect } from 'util'

// const Provider = o as any as typeof o.default
const configuration: Configuration = {
  // ... see the available options in Configuration options section
  clients: [
    {
      client_id: '***********foo***********',
      client_secret: '*********************bar*********************',
      redirect_uris: ['******************http://lvh.me:8080/cb******************'],
      // + other client properties
    },
  ],
  scopes: ['a', 'b'],
  routes: {
    authorization: '/../../.oauth/auth',
    revocation: '/../../.oauth/token/revocation',
    jwks: '/../../.oauth/jwks',
    registration: '/../../.oauth/reg',
    end_session: '/../../.oauth/session/end',
    token: '/../../.oauth/token',
    pushed_authorization_request: '/../../.oauth/request',
    userinfo: '/../../.oauth/me',
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
      async find(token) {
        const webUser = await verifyWebUserToken(token)
        console.log(`OAUTH ADAPTER ${name}: find()`, { webUser, token })
        if (!(webUser && !webUser.isRoot)) {
          return
        }
        const resp: AdapterPayload = {
          scope: 'openid',
          accountId: webUser.webUserKey,
          iat: webUser.iat,
          aud: webUser.aud === undefined || webUser.aud === null ? undefined : [webUser.aud].flat(),
          exp: webUser.exp,
          iss: webUser.iss,
          jti: webUser.jti,
          nbf: webUser.nbf,
          sub: webUser.sub,
        }
        console.log({ resp })
        return resp
      },
      async findByUid(...args) {
        console.log(`OAUTH ADAPTER ${name}: findByUid()`, ...args)
        return
      },
      async findByUserCode(...args) {
        console.log(`OAUTH ADAPTER ${name}: findByUserCode()`, ...args)
        return
      },
      async upsert(...args) {
        console.log(`OAUTH ADAPTER ${name}: upsert()`, ...args)
        return
      },
    }
  },
  features: {
    revocation: { enabled: true },
    registration: { enabled: true },
    clientCredentials: { enabled: true },
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
}

//export const provider = new Provider('http://issuerdomain.com', configuration)
export const provider = new Provider(instanceDomain, configuration)

provider.use((ctx, next) => {
  console.log(ctx.path, inspect({ ctx }, true, 10, true))
  if (ctx.request.url === '/') {
    ctx.path = '/.well-known/openid-configuration'
  } else {
    ctx.path = `/../../.oauth${ctx.path}`
  }
  return next()
  // if (ctx.path !== '/oauth-authorization-server') {
  //   return next()
  // }

  // ctx.path = '/openid-configuration'
  // return next().then(() => {
  //   ctx.path = '/oauth-authorization-server'
  // })
})
