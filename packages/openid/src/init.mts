import { /* ensureDocumentCollection,  */ getMyDB } from '@moodlenet/arangodb/server'
import { mountApp } from '@moodlenet/http-server/server'
import { shell } from './shell.mjs'
import { provider } from './xx/provider.mjs'
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
    const openIdProvider = provider.callback()
    app.use('/.well-known/((oauth-authorization-server)|(openid-configuration))', openIdProvider)
    app.use('/.oauth/', openIdProvider)
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
