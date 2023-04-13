import { instanceDomain } from '@moodlenet/core'
import { jwk } from '@moodlenet/crypto/server'
import { getProfileRecord } from '@moodlenet/react-app/server'
import Provider, { Account, Configuration } from 'oidc-provider'
import { ArangoAdapter } from './arango-adapter.mjs'
import { getPkgScopes } from './registries.mjs'
export const ___DEV_INTERACTIONS_ENABLED = false

export const providerConfig = await getProviderConfig()

export const discoveryProvider = await setupDiscoveryProvider()
export const openIdProvider = await setupOpenIdProvider()

export async function setupOpenIdProvider() {
  const openidProvider = new Provider(instanceDomain, providerConfig)
  openidProvider.use((ctx, next) => {
    ctx.path = ctx.path.replace(/^\/\.openid/, '')
    // console.log('openidProvider', op, ctx.path)
    return next()
  })

  // BEWARE: this setting should be explicitely configured or derived from http-server (#start.mts) ?
  openidProvider.proxy = true
  return openidProvider
}

export async function setupDiscoveryProvider() {
  const wellKnownProvider = new Provider(instanceDomain, providerConfig)
  wellKnownProvider.use((ctx, next) => {
    ctx.path = '/.well-known/openid-configuration'
    return next()
  })
  // BEWARE: this setting should be explicitely configured or derived from http-server (#start.mts) ?
  wellKnownProvider.proxy = true
  return wellKnownProvider
}

function getProviderConfig() {
  const registeredScopes = getPkgScopes().map(({ scope }) => scope)
  // console.log({ registeredScopes })
  const config: Configuration = {
    adapter: ArangoAdapter,
    ttl: {
      Session: 60 * 60,
      AuthorizationCode: 60 * 60,
      BackchannelAuthenticationRequest: 60 * 60,
      ClientCredentials: 60 * 60,
      DeviceCode: 60 * 60,
      Grant: 60 * 60,
      IdToken: 60 * 60,
      Interaction: 60 * 60,
      RefreshToken: 60 * 60,
      AccessToken: 60 * 60,
    },
    jwks: { keys: [jwk] },
    // ... see the available options in Configuration options section
    // clients: [
    //   {
    //     client_id: 'clid',
    //     client_secret: 'secret',
    //     redirect_uris: ['http://dev-oauth-cli.com:5000/oauth2/redirect'],
    //     // + other client properties
    //   },
    // ],
    claims: {
      openid: ['scope', 'isAdmin', 'webUserKey', 'accountId', 'exp', 'iss', 'aud'],
    },
    async findAccount(_ctx, sub /* , token */) {
      // console.log(`\n\nOAUTH findAccount()`, { ctx, sub, token })
      // if (!token) {
      //   return
      // }
      // token
      //const webUser = await verifyWebUserToken(token)
      const record = await getProfileRecord(sub)
      if (!record) {
        throw new Error(`could not find profile for accountId ${sub}`)
      }
      const profile = record.entity
      const account: Account = {
        accountId: profile._key,
        name: profile.displayName,
        given_name: profile.displayName,

        claims(/* use, scope, claims, rejected */) {
          // console.log(`\n\nOAUTH findAccount().claims`, { use, scope, claims, rejected })
          return {
            sub: profile._key, // it is essential to always return a sub claim
            given_name: profile.displayName,
            name: profile.displayName,
          }
        },
      }
      return account
    },
    scopes: registeredScopes, //['@moodlenet/ed-resource:write.own' /* , 'full-user' */],
    // cookies: { keys: ['sdaijsdajijiosadjiosdaoji'] },
    cookies: {
      names: {
        interaction: '_mn_oid_interaction',
        resume: '_mn_openid_resume',
        session: '_mn_openid_session',
        state: '_mn_openid_state',
      },
      // long: { path: '/' },
      // short: { path: '/' },
      long: { path: '/.openid/' },
      short: { path: '/.pkg/@moodlenet/openid/interaction/' },
    },
    interactions: {
      url(_ctx, interaction) {
        // console.log('interactions url', interaction, ctx)
        return `/openid/interaction/${interaction.uid}`
      },
    },

    features: {
      revocation: { enabled: true },
      registrationManagement: {
        enabled: true,
        issueRegistrationAccessToken: true,
        rotateRegistrationAccessToken: true,
      },
      registration: { enabled: true },
      clientCredentials: { enabled: true },
      // introspection: { enabled: true },
      devInteractions: { enabled: ___DEV_INTERACTIONS_ENABLED },
      deviceFlow: { enabled: true },
    },
    issueRefreshToken(ctx, client, code) {
      console.log('issueRefreshToken', { ctx, client, code })
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
