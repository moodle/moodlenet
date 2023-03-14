import { /* ensureDocumentCollection,  */ getMyDB } from '@moodlenet/arangodb/server'
import { mountApp } from '@moodlenet/http-server/server'
import { getOidcProvider } from './oidc-provider.mjs'
import { shell } from './shell.mjs'
// import { DataType } from './types/storeTypes.mjs'

export * from './lib.mjs'
export * from './types/asyncCtxTypes.mjs'

export const env = getEnv(shell.config)

export const { db } = await shell.call(getMyDB)()

// export const COLLECTION_NAME = '************************'
// export const { collection: MyCollection, newlyCreated } = await shell.call(
//   ensureDocumentCollection,
// )<DataType>(COLLECTION_NAME)

shell.call(mountApp)({
  getApp(express) {
    const app = express()
    // app.use('/oauth-authorization-server', (_req, res) => res.json({ a: 1 }))
    app.use(
      '/.well-known/((oauth-authorization-server)|(openid-configuration))',
      async (req, res) => {
        ;(await getOidcProvider()).callback()(req, res)
      },
    )
    app.use('/.openid/', async (req, res) => {
      ;(await getOidcProvider()).callback()(req, res)
    })
    return app
  },
  mountOnAbsPath: '/',
})

function getEnv(_: any): Env {
  return {
    __: _,
  }
}
export type Env = { __?: unknown }
