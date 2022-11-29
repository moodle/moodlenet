import * as graphBRules from '@moodlenet/backend/dist/adapters/b-rules'
import * as contentGraphAd from '@moodlenet/backend/dist/adapters/content-graph/arangodb/adapters'
import { arangoLocalOrgNodeAdapter } from '@moodlenet/backend/dist/adapters/content-graph/arangodb/adapters/system/localOrgNode'
import * as cryptoAdapters from '@moodlenet/backend/dist/adapters/crypto'
import { getNodemailerSendEmailAdapter } from '@moodlenet/backend/dist/adapters/emailSender/nodemailer/nodemailer'
import { createGraphQLApp } from '@moodlenet/backend/dist/adapters/http/graphqlApp'
import { startMNHttpServer } from '@moodlenet/backend/dist/adapters/http/MNHTTPServer'
import { createStaticAssetsApp } from '@moodlenet/backend/dist/adapters/http/staticAssetsApp'
import { createUnsplashApisApp } from '@moodlenet/backend/dist/adapters/http/unsplashApisApp'
import { createWebfingerApp } from '@moodlenet/backend/dist/adapters/http/webfingerApp'
import { getFsAssetAdapters } from '@moodlenet/backend/dist/adapters/staticAssets/fs/setup'
import { sharpProcessTempAsset } from '@moodlenet/backend/dist/adapters/staticAssets/processTempAsset/sharp'
import * as userAuthAdapters from '@moodlenet/backend/dist/adapters/user-auth/arangodb/adapters'
import { getVersionedDBOrThrow } from '@moodlenet/backend/dist/lib/helpers/arango/migrate/lib'
import { checkAndLogUnboundPlugRegistrations, socket } from '@moodlenet/backend/dist/lib/plug'
import * as contentGraph from '@moodlenet/backend/dist/ports/content-graph'
import * as staticAsset from '@moodlenet/backend/dist/ports/static-assets'
import * as system from '@moodlenet/backend/dist/ports/system'
import * as userAuth from '@moodlenet/backend/dist/ports/user-auth'
import { configure as webappConfigure } from '@moodlenet/webapp/serverConfigure'
import { Database } from 'arangojs'
import { DefaultDeployEnv } from './env'
import assetUploaderEnv from './env/assetUploader'
import unsplashApisEnv from './env/unsplashApis'
import { setupDb } from './setup/db'

export type Config = {
  env: DefaultDeployEnv
}
export const startDefaultMoodlenet = async ({ env: { db, fsAsset, http, crypto, nodemailer, mnStatic } }: Config) => {
  await setupDb({ env: db, actionOnDBExists: 'upgrade' })

  const contentGraphDatabase = await getVersionedDBOrThrow({ version: '2.0.1' })({
    db: new Database({ url: db.arangoUrl, databaseName: db.contentGraphDBName }),
  })

  const userAuthDatabase = await getVersionedDBOrThrow({ version: '2.0.1' })({
    db: new Database({ url: db.arangoUrl, databaseName: db.userAuthDBName }),
  })

  const pwdHashAdapters = cryptoAdapters.pwd.getPasswordCrypto()
  const jwtAdapters = cryptoAdapters.jwt.getJwtCrypto({
    ...crypto,
    signOpts: {
      algorithm: 'RS256',
    },
    verifyOpts: {
      algorithms: ['RS256'],
    },
  })
  const fsAssetAdapters = await getFsAssetAdapters({ rootDir: fsAsset.rootFolder, keepTempsForSecs: 3600 })

  socket(system.http.publicUrlProtocol.adapter, async () => http.publicUrlProtocol)

  socket(system.localOrg.node.adapter, arangoLocalOrgNodeAdapter(contentGraphDatabase))

  socket(system.crypto.passwordHasher.adapter, pwdHashAdapters.hasher)
  socket(system.crypto.passwordVerifier.adapter, pwdHashAdapters.verifier)

  socket(system.crypto.jwtVerifier.adapter, jwtAdapters.verifier)
  socket(system.crypto.jwtSigner.adapter, jwtAdapters.signer)

  socket(system.sendEmail.adapter, getNodemailerSendEmailAdapter(nodemailer))

  socket(contentGraph.graphLang.base.baseOperators, contentGraphAd.bl.arangoBaseOperators(contentGraphDatabase))
  socket(contentGraph.graphLang.graph.graphOperators, contentGraphAd.bl.arangoGraphOperators)

  socket(contentGraph.edge.del.adapter, contentGraphAd.edge.del.arangoDelEdgeAdapter(contentGraphDatabase))
  socket(contentGraph.edge.del.operators, contentGraphAd.bl.arangoDelEdgeOperators)
  socket(contentGraph.edge.del.bRules, graphBRules.edge.del.delEdgeBRules)

  socket(contentGraph.node.add.adapter, contentGraphAd.node.add.arangoAddNodeAdapter(contentGraphDatabase))
  socket(contentGraph.node.add.operators, contentGraphAd.bl.arangoAddNodeOperators)
  socket(contentGraph.node.add.bRules, graphBRules.node.add.addNodeBRules)

  socket(contentGraph.node.del.adapter, contentGraphAd.node.del.arangoDelNodeAdapter(contentGraphDatabase))
  socket(contentGraph.node.del.operators, contentGraphAd.bl.arangoDelNodeOperators)
  socket(contentGraph.node.del.bRules, graphBRules.node.del.delNodeBRules)

  socket(contentGraph.node.edit.adapter, contentGraphAd.node.edit.arangoEditNodeAdapter(contentGraphDatabase))
  socket(contentGraph.node.edit.operators, contentGraphAd.bl.arangoEditNodeOperators)
  socket(contentGraph.node.edit.bRules, graphBRules.node.edit.editNodeBRules)

  socket(contentGraph.node.read.adapter, contentGraphAd.node.read.arangoReadNodeAdapter(contentGraphDatabase))
  socket(contentGraph.node.read.operators, contentGraphAd.bl.arangoReadNodeOperators)
  socket(contentGraph.node.read.bRules, graphBRules.node.read.readNodeBRules)

  socket(contentGraph.edge.add.adapter, contentGraphAd.edge.add.arangoAddEdgeAdapter(contentGraphDatabase))
  socket(contentGraph.edge.add.operators, contentGraphAd.bl.arangoAddEdgeOperators)
  socket(contentGraph.edge.add.bRules, graphBRules.edge.add.addEdgeBRules)

  socket(contentGraph.notifications.authNode.adapter, userAuth.notifications.sendTextAdapter)

  socket(
    contentGraph.search.byTerm.adapter,
    contentGraphAd.search.byTerm.arangoSearchByTermAdapter(contentGraphDatabase),
  )
  socket(contentGraph.search.byTerm.operators, contentGraphAd.bl.arangoSearchByTermOperators)
  socket(contentGraph.search.byTerm.bRules, graphBRules.search.byTerm.searchNodeBRules)

  socket(
    contentGraph.relations.traverse.adapter,
    contentGraphAd.relations.traverse.arangoTraverseNodeRelationsAdapter(contentGraphDatabase),
  )
  socket(contentGraph.relations.traverse.operators, contentGraphAd.bl.arangoTraverseOperators)
  socket(contentGraph.relations.traverse.bRules, graphBRules.relations.traverse.relationTraverseBRules)

  socket(
    contentGraph.relations.count.adapter,
    contentGraphAd.relations.count.arangoCountNodeRelationsAdapter(contentGraphDatabase),
  )
  socket(contentGraph.relations.count.operators, contentGraphAd.bl.arangoRelCountOperators)
  socket(contentGraph.relations.count.bRules, graphBRules.relations.count.relationCountBRules)

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
  socket(staticAsset.asset.processTempAssetAdapter, sharpProcessTempAsset)

  const graphqlApp = createGraphQLApp({
    additionalResolvers: null,
  })
  const assetsApp = createStaticAssetsApp(assetUploaderEnv)
  const unsplashApp = createUnsplashApisApp(unsplashApisEnv)
  const webfingerApp = await createWebfingerApp()
  const webappConfig = webappConfigure({
    customHead: mnStatic.customHead,
    mnEnv: mnStatic.webappEnv,
  })
  await startMNHttpServer({
    httpPort: http.port,
    startServices: {
      'graphql': graphqlApp,
      'unsplash': unsplashApp,
      'assets': assetsApp,
      '.well-known': webfingerApp,
      '': webappConfig.staticFolder,
    },
    defaultGet(_req, res) {
      res.sendFile(webappConfig.defaultIndexFile)
    },
  })

  checkAndLogUnboundPlugRegistrations()
}
