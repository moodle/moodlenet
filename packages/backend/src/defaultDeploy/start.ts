import { Database } from 'arangojs'
import { Algorithm, SignOptions, VerifyOptions } from 'jsonwebtoken'
import { createTransport } from 'nodemailer'
import { ulid } from 'ulid'
import { globalSearch } from '../adapters/content-graph/arangodb/adapters/globalSearch'
import { createNodeAdapter, getNodeBySlugAdapter } from '../adapters/content-graph/arangodb/adapters/node'
import { getByAuthId } from '../adapters/content-graph/arangodb/adapters/profile'
import {
  getNodeRelationCountAdapter,
  getTraverseNodeRelAdapter,
} from '../adapters/content-graph/arangodb/adapters/traversal'
import { createGraphQLApp } from '../adapters/http/graphqlApp'
import { startMNHttpServer } from '../adapters/http/MNHTTPServer'
import { createStaticAssetsApp } from '../adapters/http/staticAssetsApp'
import { createTempAdapter } from '../adapters/staticAssets/fs/adapters/createTemp'
import { delAssetAdapter } from '../adapters/staticAssets/fs/adapters/delAsset'
import { getAssetAdapter } from '../adapters/staticAssets/fs/adapters/getAsset'
import { persistTempAssetsAdapter } from '../adapters/staticAssets/fs/adapters/persistTemp'
import { setupFs } from '../adapters/staticAssets/fs/setup'
import { activateNewUser, storeNewSignupRequest } from '../adapters/user-auth/arangodb/adapters/new-user'
import { byEmail } from '../adapters/user-auth/arangodb/adapters/session'
import { argonHashPassword, argonVerifyPassword } from '../lib/auth/argon'
import { getVersionedDBOrThrow } from '../lib/helpers/arango/migrate/lib'
import { Qmino } from '../lib/qmino'
import { createInProcessTransport } from '../lib/qmino/transports/in-process/transport'
import * as nodePorts from '../ports/content-graph/node'
import * as profilePorts from '../ports/content-graph/profile'
import * as searchPorts from '../ports/content-graph/search'
// import * as edgePorts from '../ports/content-graph/edge'
import * as traverseNodePorts from '../ports/content-graph/traverseNodeRel'
import * as assetPorts from '../ports/static-assets/asset'
import * as tmpAssetPorts from '../ports/static-assets/temp'
import * as newUserPorts from '../ports/user-auth/new-user'
// import * as userAuthConfigPorts from '../ports/user-auth/config'
import * as userPorts from '../ports/user-auth/user'
import { DefaultDeployEnv } from './env'

export type Config = {
  env: DefaultDeployEnv
}
export const startDefaultMoodlenet = async ({ env: { db, fsAsset, http, jwt, nodemailer } }: Config) => {
  const inProcessTransport = createInProcessTransport()
  const qminoInProcess = Qmino(inProcessTransport)
  const emailSender = createTransport(nodemailer.smtp)
  const userAuthDatabase = await getVersionedDBOrThrow({ version: '0.0.1' })({
    db: new Database({ url: db.arangoUrl, databaseName: db.userAuthDBName }),
  })
  const contentGraphDatabase = await getVersionedDBOrThrow({ version: '0.0.1' })({
    db: new Database({ url: db.arangoUrl, databaseName: db.contentGraphDBName }),
  })

  const jwtAlg: Algorithm = 'RS256'
  const jwtVerifyOpts: VerifyOptions = {
    algorithms: [jwtAlg],
  }
  const jwtSignOptions: SignOptions = {
    algorithm: jwtAlg,
    expiresIn: jwt.expirationSecs,
  }

  const graphqlApp = createGraphQLApp({
    additionalResolvers: null,
    jwtPrivateKey: jwt.privateKey,
    jwtSignOptions,
    qmino: qminoInProcess,
    passwordVerifier: argonVerifyPassword,
    passwordHasher: argonHashPassword,
  })
  const assetsApp = createStaticAssetsApp({ qmino: qminoInProcess })
  await startMNHttpServer({
    httpPort: http.port,
    startServices: { graphql: graphqlApp, assets: assetsApp },
    jwtPublicKey: jwt.publicKey,
    jwtVerifyOpts,
  })

  // open ports

  // userAuth Config
  // qminoInProcess.open(userAuthConfigPorts.getLatest, getConfigAdapter({ db: userAuthDatabase }))
  // qminoInProcess.open(userAuthConfigPorts.save, getConfigAdapter({ db: userAuthDatabase }))

  //

  qminoInProcess.open(nodePorts.getBySlug, getNodeBySlugAdapter(contentGraphDatabase))

  qminoInProcess.open(traverseNodePorts.fromNode, getTraverseNodeRelAdapter(contentGraphDatabase))
  qminoInProcess.open(traverseNodePorts.count, getNodeRelationCountAdapter(contentGraphDatabase))

  qminoInProcess.open(searchPorts.byTerm, globalSearch(contentGraphDatabase))

  qminoInProcess.open(userPorts.getActiveByEmail, {
    ...byEmail(userAuthDatabase),
  })

  qminoInProcess.open(profilePorts.getByAuthId, {
    ...getByAuthId(contentGraphDatabase),
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
    createNewProfile: async ({ authId, name }) => {
      return qminoInProcess.callSync(
        nodePorts.createProfile({
          partProfile: { _authId: authId, name },
        }),
        { timeout: 5000 },
      )
    },
  })

  qminoInProcess.open(nodePorts.createProfile, {
    ...createNodeAdapter(contentGraphDatabase),
  })

  qminoInProcess.open(nodePorts.createNode, createNodeAdapter(contentGraphDatabase))

  // qminoInProcess.open(edgePorts.create, createEdgeAdapter(contentGraphDatabase))
  // qminoInProcess.open(edgePorts.del, deleteEdgeAdapter(contentGraphDatabase))

  //FS asset
  const rootDir = fsAsset.rootFolder
  setupFs({ rootDir })
  qminoInProcess.open(assetPorts.del, delAssetAdapter({ rootDir }))
  qminoInProcess.open(assetPorts.get, getAssetAdapter({ rootDir }))
  qminoInProcess.open(tmpAssetPorts.createTemp, createTempAdapter({ rootDir }))
  qminoInProcess.open(tmpAssetPorts.persistTempAssets, persistTempAssetsAdapter({ rootDir }))
}
