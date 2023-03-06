import { verifyClientSession } from '@moodlenet/authentication-manager/server'
import { jwt } from '@moodlenet/crypto/server'
import { getHttpBaseUrl } from '@moodlenet/http-server/server'
import Provider, { Configuration } from 'oidc-provider'
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
        const clientSession = await verifyClientSession(token)
        const { payload } = await jwt.verify(token)
        console.log(`OAUTH ADAPTER ${name}: find()`, { clientSession, payload }, token)

        const resp = clientSession?.user &&
          payload && {
            scope: 'openid',
            accountId: clientSession.user._key,
            iat: payload.iat,
            aud:
              payload.aud === undefined || payload.aud === null ? undefined : [payload.aud].flat(),
            exp: payload.exp,
            iss: payload.iss,
            jti: payload.jti,
            nbf: payload.nbf,
            sub: payload.sub,
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
export const provider = new Provider(await getHttpBaseUrl(), configuration)

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
