import { Account, Configuration, interactionPolicy } from 'oidc-provider'
import { KVStore } from '../../key-value-store/src/server/types.js'
import { OpenIdKeyValueData, StoreItem } from './types/storeTypes.mjs'
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

export function getProviderConfig(kvStore: KVStore<OpenIdKeyValueData>) {
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
    async findAccount(ctx, sub, token) {
      console.log(`\n\nOAUTH findAccount()`, { ctx, sub, token })
      if (!token) {
        return
      }
      token
      //const webUser = await verifyWebUserToken(token)
      const account: Account = {
        accountId: 'ciccioid',
        claims(use, scope, claims, rejected) {
          console.log(`\n\nOAUTH findAccount().claims`, { use, scope, claims, rejected })
          return { sub: 'ciccioidSub' }
        },
      }
      return account
    },
    scopes: ['openid' /* , 'full-user' */],
    // cookies: { keys: ['sdaijsdajijiosadjiosdaoji'] },
    interactions: {
      // url(_ctx, interaction) {
      //   console.log('interaction', interaction)
      //   return `/login?interaction=${interaction.uid}`
      // },
      // url(_ctx, interaction) {
      //   console.log('interaction', interaction)
      //   return `/.openid/interaction/${interaction.uid}`
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
    adapter(model) {
      return {
        async destroy(id) {
          console.log(`\n\nOAUTH destroy(id) {`, { id, model })

          await kvStore.unset(model, id)
        },

        async consume(id) {
          console.log(`\n\nOAUTH consume(id) {`, { id, model })

          const item = (await kvStore.get(model, id)).value
          if (!item) {
            return
          }
          item.payload.consumed = new Date().toISOString()
        },

        async find(id) {
          console.log(`\n\nOAUTH find(id) {`, { id, model })

          const item = (await kvStore.get(model, id)).value
          console.log(`\n\nOAUTH find(id) {`, { found: item })
          const payload = item && { ...item.payload, session: { accountId: '737' } } // FIXME: set correct sessionAccoutId (maybe depends on model ? 'Interaction' ? ??)

          return payload
        },

        async findByUid(uid) {
          console.log(`\n\nOAUTH findByUid(uid) {`, { uid, model })

          const id = await (await kvStore.get(SESSION_UID_KEY, uid)).value
          if ('string' !== typeof id) {
            return
          }
          return this.find(id)
        },

        async findByUserCode(userCode) {
          console.log(`\n\nOAUTH findByUserCode(userCode) {`, { userCode, model })

          const id = (await kvStore.get(USER_CODE_KEY, userCode)).value
          if ('string' !== typeof id) {
            return
          }
          return this.find(id)
        },

        async upsert(id, payload, expiresIn) {
          console.log(`\n\nOAUTH upsert(id, payload, expiresIn) {`, {
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

            payload,
            // payload: { ...payload, session: { accountId: '737' } },// FIXME: set correct sessionAccoutId
          }
          await kvStore.set(model, id, storeItem) // FIXME: set expiresIn
        },

        async revokeByGrantId(grantId) {
          console.log(`\n\nOAUTH revokeByGrantId(grantId) {`, { grantId, model })

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
      devInteractions: { enabled: true },
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
