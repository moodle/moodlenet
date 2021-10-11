import { getAddEdgeAssumptionsMap } from '@moodlenet/common/lib/content-graph/bl/rules/addEdgeAssumptions'
import { Database } from 'arangojs'
import * as contentGraphAd from '../adapters/content-graph/arangodb/adapters'
import * as cryptoAdapters from '../adapters/crypto'
import { getNodemailerSendEmailAdapter } from '../adapters/emailSender/nodemailer/nodemailer'
import { createGraphQLApp } from '../adapters/http/graphqlApp'
import { startMNHttpServer } from '../adapters/http/MNHTTPServer'
import { createStaticAssetsApp } from '../adapters/http/staticAssetsApp'
import { createWebfingerApp } from '../adapters/http/webfingerApp'
import { getFsAssetAdapters } from '../adapters/staticAssets/fs/setup'
import * as userAuthAdapters from '../adapters/user-auth/arangodb/adapters'
import { getVersionedDBOrThrow } from '../lib/helpers/arango/migrate/lib'
import { checkAndLogUnboundPlugRegistrations, socket } from '../lib/plug'
import * as contentGraph from '../ports/content-graph'
import * as staticAsset from '../ports/static-assets'
import * as userAuth from '../ports/user-auth'
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
  const userAuthDatabase = await getVersionedDBOrThrow({ version: '0.0.2' })({
    db: new Database({ url: db.arangoUrl, databaseName: db.userAuthDBName }),
  })
  const contentGraphDatabase = await getVersionedDBOrThrow({ version: '0.0.3' })({
    db: new Database({ url: db.arangoUrl, databaseName: db.contentGraphDBName }),
  })

  const jwtAdapters = cryptoAdapters.jwt.getJwtCrypto({
    ...jwt,
    signOpts: {
      algorithm: 'RS256',
    },
    verifyOpts: {
      algorithms: ['RS256'],
    },
  })

  const pwdHashAdapters = cryptoAdapters.pwd.getPasswordCrypto()
  const fsAssetAdapters = await getFsAssetAdapters({ rootDir: fsAsset.rootFolder })

  socket(userAuth.adapters.passwordHasher, pwdHashAdapters.hasher)
  socket(userAuth.adapters.passwordVerifier, pwdHashAdapters.verifier)

  socket(userAuth.adapters.jwtVerifierAdapter, jwtAdapters.verifier)
  socket(userAuth.adapters.jwtSignerAdapter, jwtAdapters.signer)

  socket(userAuth.adapters.sendEmailAdapter, getNodemailerSendEmailAdapter(nodemailer))
  socket(
    contentGraph.common.getBaseOperatorsAdapter,
    contentGraphAd.baseOperators.getBaseOperators(contentGraphDatabase),
  )
  socket(contentGraph.common.getGraphOperatorsAdapter, contentGraphAd.graphOperators.getGraphOperators)
  socket(contentGraph.edge.addEdgeAdapter, contentGraphAd.edge.addEdge(contentGraphDatabase))
  socket(contentGraph.edge.deleteEdgeAdapter, contentGraphAd.edge.deleteEdge(contentGraphDatabase))
  socket(contentGraph.node.createNodeAdapter, contentGraphAd.node.createNode(contentGraphDatabase))
  socket(contentGraph.node.deleteNodeAdapter, contentGraphAd.node.deleteNode(contentGraphDatabase))
  socket(contentGraph.node.editNodeAdapter, contentGraphAd.node.editNode(contentGraphDatabase))
  socket(contentGraph.edge.getAddEdgeOperatorsAdapter, contentGraphAd.addEdgeOperators.getAddEgdeOperators)
  socket(contentGraph.edge.getAddEdgeAssumptionsMap, getAddEdgeAssumptionsMap)

  socket(contentGraph.profile.sendTextToProfileAdapter, userAuth.notifications.sendTextAdapter)
  socket(contentGraph.search.searchByTermAdapter, contentGraphAd.globalSearch.searchByTerm(contentGraphDatabase))
  socket(
    contentGraph.traverseNodeRel.traverseNodeRelationsAdapter,
    contentGraphAd.traversal.traverseNodeRelations(contentGraphDatabase),
  )
  socket(
    contentGraph.traverseNodeRel.countNodeRelationsAdapter,
    contentGraphAd.traversal.countNodeRelations(contentGraphDatabase),
  )
  socket(userAuth.adapters.localDomainAdapter, async () => domain)

  socket(userAuth.adapters.getLatestConfigAdapter, userAuthAdapters.config.getLatestConfig(userAuthDatabase))
  socket(userAuth.adapters.getActiveUserByAuthAdapter, userAuthAdapters.user.getActiveUserByAuth(userAuthDatabase))
  socket(userAuth.adapters.getActiveUserByEmailAdapter, userAuthAdapters.user.getActiveUserByEmail(userAuthDatabase))
  socket(
    userAuth.adapters.changePasswordByAuthIdAdapter,
    userAuthAdapters.user.changePasswordByAuthId(userAuthDatabase),
  )
  socket(userAuth.adapters.saveActiveUserAdapter, userAuthAdapters.newUser.saveActiveUser(userAuthDatabase))

  socket(staticAsset.temp.persistTempAssetsAdapter, fsAssetAdapters.persistTempAssetsAdapter)
  socket(staticAsset.temp.createTempAssetAdapter, fsAssetAdapters.createTempAssetAdapter)
  socket(staticAsset.asset.getAssetAdapter, fsAssetAdapters.getAssetAdapter)
  socket(staticAsset.asset.delAssetAdapter, fsAssetAdapters.delAssetAdapter)

  const graphqlApp = createGraphQLApp({
    additionalResolvers: null,
  })
  const assetsApp = createStaticAssetsApp({})
  const webfingerApp = createWebfingerApp({ domain })
  const [webappRootDir, defaultHtml] = require('@moodlenet/webapp/publicFolder') as [string, string]
  await startMNHttpServer({
    httpPort: http.port,
    startServices: {
      'graphql': graphqlApp,
      'assets': assetsApp,
      '.well-known': webfingerApp,
      '': webappRootDir,
    },
    defaultGet(_req, res) {
      res.sendFile(defaultHtml)
    },
  })

  checkAndLogUnboundPlugRegistrations()
}
