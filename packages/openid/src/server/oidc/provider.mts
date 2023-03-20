import { instanceDomain } from '@moodlenet/core'
import Provider, { Account, Configuration } from 'oidc-provider'
import { kvStore } from '../kvStore.mjs'
import { StoreItem } from '../types/storeTypes.mjs'
const GRANT_KEY = `grant`
const SESSION_UID_KEY = `sessionUid`
const USER_CODE_KEY = `userCode`

const GRANTABLE = new Set([
  'AccessToken',
  'AuthorizationCode',
  'RefreshToken',
  'DeviceCode',
  'BackchannelAuthenticationRequest',
])
const FAKE_ACCOUNT_ID = '1111'
const DEV_INTERACTIONS_ENABLED = false

export const providerConfig = await getProviderConfig()

export const discoveryProvider = await setupDiscoveryProvider()
export const openIdProvider = await setupOpenIdProvider()

export async function setupOpenIdProvider() {
  const openidProvider = new Provider(instanceDomain, providerConfig)
  openidProvider.use((ctx, next) => {
    const op = ctx.path
    ctx.path = ctx.path.replace(/^\/\.openid/, '')
    console.log('openidProvider', op, ctx.path)
    return next()
  })
  return openidProvider
}

export async function setupDiscoveryProvider() {
  const wellKnownProvider = new Provider(instanceDomain, providerConfig)
  wellKnownProvider.use((ctx, next) => {
    ctx.path = '/.well-known/openid-configuration'
    return next()
  })
  return wellKnownProvider
}

export function getProviderConfig() {
  const config: Configuration = {
    // ... see the available options in Configuration options section
    clients: [
      {
        client_id: 'clid',
        client_secret: 'secret',
        redirect_uris: ['http://dev-oauth-cli.com:5000/oauth2/redirect'],
        // + other client properties
      },
    ],
    claims: {
      openid: ['scope', 'isAdmin', 'webUserKey', 'accountId', 'exp', 'iss', 'aud'],
    },
    async findAccount(ctx, sub, token) {
      console.log(`\n\nOAUTH findAccount()`, { ctx, sub, token })
      // if (!token) {
      //   return
      // }
      // token
      //const webUser = await verifyWebUserToken(token)
      const account: Account = {
        accountId: FAKE_ACCOUNT_ID,
        email: 'this.profile.email',
        email_verified: true,
        family_name: 'this.profile.family_name',
        given_name: 'this.profile.given_name',
        locale: 'it',
        name: `this.profile.name (${sub})`,
        claims(use, scope, claims, rejected) {
          console.log(`\n\nOAUTH findAccount().claims`, { use, scope, claims, rejected })
          return {
            sub: FAKE_ACCOUNT_ID, // it is essential to always return a sub claim
            email: 'this.profile.email',
            email_verified: true,
            family_name: 'this.profile.family_name',
            given_name: 'this.profile.given_name',
            locale: 'it',
            name: `this.profile.name (${sub})`,
          }
        },
      }
      return account
    },
    scopes: ['openid' /* , 'full-user' */],
    // cookies: { keys: ['sdaijsdajijiosadjiosdaoji'] },
    cookies: {
      names: {
        interaction: '_mn-oid_interaction',
        resume: '_mn-oid_resume',
        session: '_mn-oid_session',
        state: '_mn-oid_state',
      },
    },
    interactions: {
      url(ctx, interaction) {
        console.log('interactions url', interaction, ctx)
        return `/@moodlenet/openid/interaction/${interaction.uid}`
      },
      // url(_ctx, interaction) {
      //   console.log('interaction', interaction)
      //   return `/login?interaction=${interaction.uid}`
      // },
      // url(_ctx, interaction) {
      //   console.log('interaction', interaction)
      //   return `/.openid/interaction/${interaction.uid}`
      // },
      policy: undefined,
      // policy: DEV_INTERACTIONS_ENABLED
      //   ? [
      //       new interactionPolicy.Prompt(
      //         { name: 'consent', requestable: true },
      //         ...[
      //           // 'no_session',
      //           'consent',
      //           // 'login',
      //           // 'max_age',
      //           // 'id_token_hint',
      //           // 'claims_id_token_sub_value',
      //           // 'essential_acrs',
      //           // 'essential_acr',
      //           // 'native_client_prompt',
      //           // 'op_scopes_missing',
      //           // 'op_claims_missing',
      //           // 'rs_scopes_missing',
      //         ].map(
      //           _ =>
      //             new interactionPolicy.Check(
      //               _,
      //               `${_} consent desc`,
      //               `${_} consent err`,
      //               () => true,
      //             ),
      //         ),
      //       ),
      //       new interactionPolicy.Prompt(
      //         { name: 'login', requestable: true },
      //         ...[
      //           // 'no_session',
      //           // 'consent',
      //           'login',
      //           // 'max_age',
      //           // 'id_token_hint',
      //           // 'claims_id_token_sub_value',
      //           // 'essential_acrs',
      //           // 'essential_acr',
      //           // 'native_client_prompt',
      //           // 'op_scopes_missing',
      //           // 'op_claims_missing',
      //           // 'rs_scopes_missing',
      //         ].map(
      //           _ =>
      //             new interactionPolicy.Check(_, `${_} login desc`, `${_} login err`, () => true),
      //         ),
      //       ),
      //     ]
      //   : undefined,
    },
    adapter(model) {
      return {
        async destroy(id) {
          console.log(`\n\nOAUTH ${model} destroy(id) {`, { id, model })

          await kvStore.unset(model, id)
        },

        async consume(id) {
          console.log(`\n\nOAUTH ${model} consume(id) {`, { id, model })

          const item = (await kvStore.get(model, id)).value
          if (!item) {
            return
          }
          item.payload.consumed = new Date().toISOString()
        },

        async find(id) {
          console.log(`\n\nOAUTH ${model} find(id) {`, { id, model })

          const item = (await kvStore.get(model, id)).value
          console.log(`\n\nOAUTH ${model} find(id) {`, { found: item })
          // const payload = item && { ...item.payload, session: { accountId: FAKE_ACCOUNT_ID } } // FIXME: set correct sessionAccoutId (maybe depends on model ? 'Interaction' ? ??)
          const payload = item?.payload

          return payload
        },

        async findByUid(uid) {
          console.log(`\n\nOAUTH ${model} findByUid(uid) {`, { uid, model })

          const id = await (await kvStore.get(SESSION_UID_KEY, uid)).value
          if ('string' !== typeof id) {
            return
          }
          return this.find(id)
        },

        async findByUserCode(userCode) {
          console.log(`\n\nOAUTH ${model} findByUserCode(userCode) {`, { userCode, model })

          const id = (await kvStore.get(USER_CODE_KEY, userCode)).value
          if ('string' !== typeof id) {
            return
          }
          return this.find(id)
        },

        async upsert(id, payload, expiresIn) {
          console.log(`\n\nOAUTH ${model} upsert(id, payload, expiresIn) {`, {
            id,
            payload,
            expiresIn,
            model,
          })

          if (model === 'Session' && payload.uid) {
            await kvStore.set(SESSION_UID_KEY, payload.uid, id) // FIXME: set expiresIn
          }

          const { grantId, userCode } = payload
          if (GRANTABLE.has(model) && grantId) {
            const grant = (await kvStore.get(GRANT_KEY, grantId)).value ?? []
            await kvStore.set(GRANT_KEY, grantId, [...grant, [model, id]])
          }

          if (userCode) {
            await kvStore.set(USER_CODE_KEY, userCode, id) // FIXME: set expiresIn
          }

          const storeItem: StoreItem = {
            expiresIn: expiresIn,
            insertedAt: new Date().toISOString(),

            // payload,
            payload: {
              ...payload,
              accountId: FAKE_ACCOUNT_ID,
              session: { accountId: FAKE_ACCOUNT_ID },
            }, // FIXME: set correct sessionAccoutId
          }
          await kvStore.set(model, id, storeItem) // FIXME: set expiresIn
        },

        async revokeByGrantId(grantId) {
          console.log(`\n\nOAUTH ${model} revokeByGrantId(grantId) {`, { grantId, model })

          // eslint-disable-line class-methods-use-this
          const grant = (await kvStore.get(GRANT_KEY, grantId)).value
          if (grant) {
            await Promise.all(grant.map(([model, id]) => kvStore.unset(model, id)))
            kvStore.unset(GRANT_KEY, grantId)
          }
        },
      }
    },

    features: {
      revocation: { enabled: true },
      registration: { enabled: true },
      clientCredentials: { enabled: true },
      introspection: { enabled: true },
      devInteractions: { enabled: DEV_INTERACTIONS_ENABLED },
      deviceFlow: { enabled: true },
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
