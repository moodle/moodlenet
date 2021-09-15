import { Database } from 'arangojs'
import { Algorithm, SignOptions, VerifyOptions } from 'jsonwebtoken'
import { createTransport } from 'nodemailer'
import { createEdgeAdapter, deleteEdgeAdapter } from '../adapters/content-graph/arangodb/adapters/edge'
import { globalSearch } from '../adapters/content-graph/arangodb/adapters/globalSearch'
import {
  createNodeAdapter,
  deleteNodeAdapter,
  editNodeAdapter,
  getNodeByIdentifierAdapter,
  getNodeBySlugAdapter,
} from '../adapters/content-graph/arangodb/adapters/node'
import { getByAuthId } from '../adapters/content-graph/arangodb/adapters/profile'
import {
  getNodeRelationCountAdapter,
  getTraverseNodeRelAdapter,
} from '../adapters/content-graph/arangodb/adapters/traversal'
import { createGraphQLApp } from '../adapters/http/graphqlApp'
import { startMNHttpServer } from '../adapters/http/MNHTTPServer'
import { createStaticAssetsApp } from '../adapters/http/staticAssetsApp'
import { createWebfingerApp } from '../adapters/http/webfingerApp'
import { createTempAdapter } from '../adapters/staticAssets/fs/adapters/createTemp'
import { delAssetAdapter } from '../adapters/staticAssets/fs/adapters/delAsset'
import { getAssetAdapter } from '../adapters/staticAssets/fs/adapters/getAsset'
import { persistTempAssetsAdapter } from '../adapters/staticAssets/fs/adapters/persistTemp'
import { setupFs } from '../adapters/staticAssets/fs/setup'
import { getConfigAdapter } from '../adapters/user-auth/arangodb/adapters/config'
import { storeNewActiveUser, storeNewSignupRequest } from '../adapters/user-auth/arangodb/adapters/new-user'
import { byAuthId, byEmail, updateUserPasswordByAuthId } from '../adapters/user-auth/arangodb/adapters/user'
import { argonHashPassword, argonVerifyPassword } from '../lib/auth/argon'
import { signJwtAny, verifyJwtAny } from '../lib/auth/jwt'
import { getVersionedDBOrThrow } from '../lib/helpers/arango/migrate/lib'
import { Qmino } from '../lib/qmino'
import { createInProcessTransport } from '../lib/qmino/transports/in-process/transport'
import * as edgePorts from '../ports/content-graph/edge'
import * as nodePorts from '../ports/content-graph/node'
import * as profilePorts from '../ports/content-graph/profile'
import * as searchPorts from '../ports/content-graph/search'
import * as traverseNodePorts from '../ports/content-graph/traverseNodeRel'
import * as assetPorts from '../ports/static-assets/asset'
import * as tmpAssetPorts from '../ports/static-assets/temp'
import * as newUserPorts from '../ports/user-auth/new-user'
// import * as userAuthConfigPorts from '../ports/user-auth/config'
import * as userPorts from '../ports/user-auth/user'
import * as utilsPorts from '../ports/utils/utils'
import { DefaultDeployEnv } from './env'

export type Config = {
  env: DefaultDeployEnv
}
export const startDefaultMoodlenet = async ({
  env: {
    db,
    fsAsset,
    http,
    jwt,
    nodemailer,
    mnStatic: { domain },
  },
}: Config) => {
  const inProcessTransport = createInProcessTransport()
  const qminoInProcess = Qmino(inProcessTransport)
  const emailSender = createTransport(nodemailer.smtp)
  const userAuthDatabase = await getVersionedDBOrThrow({ version: '0.0.2' })({
    db: new Database({ url: db.arangoUrl, databaseName: db.userAuthDBName }),
  })
  const contentGraphDatabase = await getVersionedDBOrThrow({ version: '0.0.3' })({
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
    // passwordVerifier: argonVerifyPassword,
    passwordHasher: argonHashPassword,
  })
  const assetsApp = createStaticAssetsApp({ qmino: qminoInProcess })
  const webfingerApp = createWebfingerApp({ qmino: qminoInProcess, domain })
  await startMNHttpServer({
    httpPort: http.port,
    startServices: { 'graphql': graphqlApp, 'assets': assetsApp, '.well-known': webfingerApp },
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

  qminoInProcess.open(userPorts.recoverPasswordEmail, {
    ...byEmail(userAuthDatabase),
    ...storeNewSignupRequest(userAuthDatabase),
    async jwtSigner(recoverPasswordJwt, expiresSecs) {
      return signJwtAny({
        jwtPrivateKey: jwt.privateKey,
        jwtSignOptions: {
          ...jwtSignOptions,
          expiresIn: expiresSecs,
        },
        payload: recoverPasswordJwt,
      })
    },
    publicBaseUrl: http.publicUrl,
    sendEmail: _ => emailSender.sendMail(_),
  })

  qminoInProcess.open(userPorts.changeRecoverPassword, {
    ...byEmail(userAuthDatabase),
    hasher: argonHashPassword,
    jwtVerifier: async recoverPasswordJwtStr =>
      verifyJwtAny({
        jwtPublicKey: jwt.publicKey,
        jwtVerifyOpts,
        token: recoverPasswordJwtStr,
      }),
    changePasswordByAuthId: ({ authId, newPassword }) => {
      return updateUserPasswordByAuthId(userAuthDatabase)({ authId, password: newPassword })
    },
  })

  qminoInProcess.open(userPorts.createSession, {
    ...byEmail(userAuthDatabase),
    jwtVerifier: async recoverPasswordJwtStr =>
      verifyJwtAny({
        jwtPublicKey: jwt.publicKey,
        jwtVerifyOpts,
        token: recoverPasswordJwtStr,
      }),
    saveActiveUser: storeNewActiveUser(userAuthDatabase),
    createNewProfile: async ({ authId, name }) => {
      return qminoInProcess.callSync(
        nodePorts.createProfile({
          partProfile: { _authId: authId, name },
        }),
        { timeout: 5000 },
      )
    },
    ...byEmail(userAuthDatabase),
    jwtPrivateKey: jwt.privateKey,
    jwtSignOptions,
    passwordVerifier: argonVerifyPassword,
  })

  qminoInProcess.open(profilePorts.getByAuthId, {
    ...getByAuthId(contentGraphDatabase),
  })

  qminoInProcess.open(newUserPorts.signUp, {
    ...storeNewSignupRequest(userAuthDatabase),
    publicBaseUrl: http.publicUrl,
    sendEmail: _ => emailSender.sendMail(_),
    getConfig: () => getConfigAdapter({ db: userAuthDatabase }).getLatestConfig(),
    async jwtSigner(recoverPasswordJwt, expiresSecs) {
      return signJwtAny({
        jwtPrivateKey: jwt.privateKey,
        jwtSignOptions: {
          ...jwtSignOptions,
          expiresIn: expiresSecs,
        },
        payload: recoverPasswordJwt,
      })
    },
  })

  // qminoInProcess.open(newUserPorts.confirmSignup, {
  //   ...storeNewActiveUser(userAuthDatabase),
  //   createNewProfile: async ({ authId, name }) => {
  //     return qminoInProcess.callSync(
  //       nodePorts.createProfile({
  //         partProfile: { _authId: authId, name },
  //       }),
  //       { timeout: 5000 },
  //     )
  //   },
  // })

  qminoInProcess.open(nodePorts.createProfile, {
    ...createNodeAdapter(contentGraphDatabase),
  })
  qminoInProcess.open(nodePorts.deleteNode, {
    ...deleteNodeAdapter(contentGraphDatabase),
  })

  qminoInProcess.open(nodePorts.createNode, {
    ...createNodeAdapter(contentGraphDatabase),
    createEdge: ({ from, newEdge, sessionEnv, to }) =>
      qminoInProcess.callSync(edgePorts.createEdge({ from, newEdge, sessionEnv, to }), { timeout: 5000 }),
    getProfileByAuthId: ({ authId }) => qminoInProcess.query(profilePorts.getByAuthId({ authId }), { timeout: 5000 }),
  })

  qminoInProcess.open(nodePorts.editNode, {
    ...editNodeAdapter(contentGraphDatabase),
  })

  qminoInProcess.open(edgePorts.createEdge, createEdgeAdapter(contentGraphDatabase))
  qminoInProcess.open(edgePorts.deleteEdge, deleteEdgeAdapter(contentGraphDatabase))

  const nodeIdAdapter = getNodeByIdentifierAdapter(contentGraphDatabase)
  const userAuthIdAdapter = byAuthId(userAuthDatabase)

  qminoInProcess.open(utilsPorts.sendEmailToProfile, {
    ...userAuthIdAdapter,
    getLocalDomain: async () => domain,
    getProfile: nodeIdAdapter.getNodeByIdentifier,
    getProfileByAuth: ({ authId }) => qminoInProcess.query(profilePorts.getByAuthId({ authId }), { timeout: 5000 }),
    sendEmail: _ =>
      emailSender.sendMail(_).then(
        _ => true,
        _ => false,
      ),
  })

  //FS asset
  const rootDir = fsAsset.rootFolder
  setupFs({ rootDir })
  qminoInProcess.open(assetPorts.del, delAssetAdapter({ rootDir }))
  qminoInProcess.open(assetPorts.get, getAssetAdapter({ rootDir }))
  qminoInProcess.open(tmpAssetPorts.createTemp, createTempAdapter({ rootDir }))
  qminoInProcess.open(tmpAssetPorts.persistTempAssets, persistTempAssetsAdapter({ rootDir }))
}
