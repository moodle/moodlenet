import { Database } from 'arangojs'
import { Algorithm, SignOptions, VerifyOptions } from 'jsonwebtoken'
import { createTransport } from 'nodemailer'
import { ulid } from 'ulid'
import { createEdgeAdapter, deleteEdgeAdapter } from '../adapters/content-graph/arangodb/adapters/edge'
import { globalSearch } from '../adapters/content-graph/arangodb/adapters/globalSearch'
import { createNodeAdapter, getNodeByIdAdapter } from '../adapters/content-graph/arangodb/adapters/node'
import { graphqlArangoContentGraphResolvers } from '../adapters/content-graph/arangodb/graphql/additional-resolvers'
import { createGraphQLApp } from '../adapters/http/graphqlApp'
import { startMNHttpServer } from '../adapters/http/MNHTTPServer'
import { createStaticAssetsApp } from '../adapters/http/staticAssetsApp'
import { createTempAdapter } from '../adapters/staticAssets/fs/adapters/createTemp'
import { delAssetAdapter } from '../adapters/staticAssets/fs/adapters/delAsset'
import { getAssetAdapter } from '../adapters/staticAssets/fs/adapters/getAsset'
import { persistTempAssetsAdapter } from '../adapters/staticAssets/fs/adapters/persistTemp'
import { setupFs } from '../adapters/staticAssets/fs/setup'
import { activateNewUser, createNewUser, storeNewSignupRequest } from '../adapters/user-auth/arangodb/adapters/new-user'
import { byUsername } from '../adapters/user-auth/arangodb/adapters/session'
import { argonHashPassword, argonVerifyPassword } from '../lib/auth/argon'
import { SystemSessionEnv } from '../lib/auth/env'
import { getVersionedDBOrThrow } from '../lib/helpers/arango/migrate/lib'
import { Qmino } from '../lib/qmino'
import { createInProcessTransport } from '../lib/qmino/transports/in-process/transport'
import * as edgePorts from '../ports/content-graph/edge'
import * as nodePorts from '../ports/content-graph/node'
import * as searchPorts from '../ports/content-graph/search'
import * as setupPorts from '../ports/setup'
import * as assetPorts from '../ports/static-assets/asset'
import * as tmpAssetPorts from '../ports/static-assets/temp'
import * as newUserPorts from '../ports/user-auth/new-user'
import * as userPorts from '../ports/user-auth/user'
import { DefaultDeployEnv } from './env'

export type Config = {
  env: DefaultDeployEnv
}
export const startDefaultMoodlenet = async ({ env: { db, fsAsset, http, jwt, nodemailer } }: Config) => {
  const inProcessTransport = createInProcessTransport()
  const qminoInProcess = Qmino(inProcessTransport)
  const emailSender = createTransport(nodemailer.smtp)
  const userAuthDatabase = await getVersionedDBOrThrow({ version: '0.0.2' })({
    db: new Database({ url: db.arangoUrl, databaseName: db.userAuthDBName }),
  })
  const contentGraphDatabase = await getVersionedDBOrThrow({ version: '0.0.1' })({
    db: new Database({ url: db.arangoUrl, databaseName: db.contentGraphDBName }),
  })
  const arangoContentGraphAdditionalGQLResolvers = graphqlArangoContentGraphResolvers(contentGraphDatabase)

  const jwtAlg: Algorithm = 'RS256'
  const jwtVerifyOpts: VerifyOptions = {
    algorithms: [jwtAlg],
  }
  const jwtSignOptions: SignOptions = {
    algorithm: jwtAlg,
    expiresIn: jwt.expirationSecs,
  }

  const graphqlApp = createGraphQLApp({
    additionalResolvers: { ...arangoContentGraphAdditionalGQLResolvers },
    jwtPrivateKey: jwt.privateKey,
    jwtSignOptions,
    qmino: qminoInProcess,
  })
  const assetsApp = createStaticAssetsApp({ qmino: qminoInProcess })
  await startMNHttpServer({
    httpPort: http.port,
    startServices: { graphql: graphqlApp, assets: assetsApp },
    jwtPublicKey: jwt.publicKey,
    jwtVerifyOpts,
  })

  // open ports

  qminoInProcess.open(nodePorts.byId, getNodeByIdAdapter(contentGraphDatabase))

  qminoInProcess.open(searchPorts.byTerm, globalSearch(contentGraphDatabase))

  qminoInProcess.open(userPorts.getActiveByUsername, {
    ...byUsername(userAuthDatabase),
    verifyPassword: argonVerifyPassword(),
  })

  qminoInProcess.open(newUserPorts.signUp, {
    ...storeNewSignupRequest(userAuthDatabase),
    publicBaseUrl: http.publicUrl,
    generateToken: async () => ulid(),
    sendEmail: _ =>
      emailSender.sendMail(_).then(
        _ => (console.log(_), _),
        _ => (console.log(_), Promise.reject(_)),
      ),
  })

  qminoInProcess.open(newUserPorts.confirmSignup, {
    ...activateNewUser(userAuthDatabase),
    hashPassword: (plain: string) => argonHashPassword({ pwd: plain }),
    createNewProfile: async ({ username, env }) => {
      return qminoInProcess.callSync(
        nodePorts.create<'Profile'>({
          env,
          data: { name: username, summary: '' },
          nodeType: 'Profile',
          key: username,
        }),
        { timeout: 5000 },
      )
    },
  })
  qminoInProcess.open(newUserPorts.createNewUser, {
    ...createNewUser(userAuthDatabase),
    hashPassword: (plain: string) => argonHashPassword({ pwd: plain }),
    createNewProfile: async ({ username }) => {
      return qminoInProcess.callSync(
        nodePorts.create<'Profile'>({
          env: SystemSessionEnv(),
          data: { name: username, summary: '' },
          nodeType: 'Profile',
          key: username,
        }),
        { timeout: 5000 },
      )
    },
  })

  qminoInProcess.open(nodePorts.create, createNodeAdapter(contentGraphDatabase))

  qminoInProcess.open(edgePorts.create, createEdgeAdapter(contentGraphDatabase))
  qminoInProcess.open(edgePorts.del, deleteEdgeAdapter(contentGraphDatabase))

  //FS asset
  const rootDir = fsAsset.rootFolder
  setupFs({ rootDir })
  qminoInProcess.open(assetPorts.del, delAssetAdapter({ rootDir }))
  qminoInProcess.open(assetPorts.get, getAssetAdapter({ rootDir }))
  qminoInProcess.open(tmpAssetPorts.createTemp, createTempAdapter({ rootDir }))
  qminoInProcess.open(tmpAssetPorts.persistTempAssets, persistTempAssetsAdapter({ rootDir }))

  //Setup
  qminoInProcess.open(setupPorts.initialContent, { qmino: qminoInProcess })
}
