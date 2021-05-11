import { idKeyFromId, makeId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { Database } from 'arangojs'
import { SignOptions, VerifyOptions } from 'jsonwebtoken'
import SshPK from 'sshpk'
import { ulid } from 'ulid'
import * as Yup from 'yup'
import { createEdgeAdapter, deleteEdgeAdapter } from './adapters/content-graph/arangodb/adapters/edge'
import { globalSearch } from './adapters/content-graph/arangodb/adapters/globalSearch'
import { createNodeAdapter, getNodeByIdAdapter } from './adapters/content-graph/arangodb/adapters/node'
import { graphqlArangoContentGraphResolvers } from './adapters/content-graph/arangodb/graphql/additional-resolvers'
import { createGraphQLApp } from './adapters/http/graphqlApp'
import { startMNHttpServer } from './adapters/http/MNHTTPServer'
import { activateNewUser, storeNewSignupRequest } from './adapters/user-auth/arangodb/adapters/new-user'
import { byUsername } from './adapters/user-auth/arangodb/adapters/session'
import { argonHashPassword, argonVerifyPassword } from './lib/auth/argon'
import { getSystemExecutionContext } from './lib/auth/types'
import { ulidKey } from './lib/helpers/arango'
import { open, resolve } from './lib/qmino'
import { createMailgunSender } from './lib/sendersImpl/mailgun/mailgunSender'
import * as edgePorts from './ports/content-graph/edge'
import * as nodePorts from './ports/content-graph/node'
import * as searchPorts from './ports/content-graph/search'
import * as newUserports from './ports/user-auth/new-user'
import * as userPorts from './ports/user-auth/user'

export const startDefaultMoodlenet = async () => {
  const httpPort = Number(process.env.HTTP_GRAPHQL_PORT) || 8080
  const mailgunApiKey = process.env.MAILGUN_API_KEY
  const mailgunDomain = process.env.MAILGUN_DOMAIN
  const arangoUrl = process.env.ARANGO_HOST
  const jwtPrivateKey = process.env.JWT_PRIVATE_KEY
  const jwtPublicKey = process.env.JWT_PUBLIC_KEY
  const jwtExpirationSecs = parseInt(String(process.env.JWT_EXPIRATION_SECS))
  const PUBLIC_URL = process.env.PUBLIC_URL

  if (
    !(arangoUrl && mailgunApiKey && mailgunDomain && jwtPrivateKey && jwtExpirationSecs && jwtPublicKey && PUBLIC_URL)
  ) {
    throw new Error(`missing env`)
  }

  const publicBaseUrl = Yup.string().required().validateSync(PUBLIC_URL) // TODO:  in RootValue ?

  SshPK.parseKey(jwtPrivateKey, 'pem')

  if (!isFinite(jwtExpirationSecs)) {
    throw new Error(
      `JWT_EXPIRATION_SECS env var must represent an integer, found "${process.env.JWT_EXPIRATION_SECS}" instead`,
    )
  }
  const emailSender = createMailgunSender({ apiKey: mailgunApiKey, domain: mailgunDomain })
  const contentGraphDatabase = new Database({ url: arangoUrl, databaseName: 'ContentGraph' })
  const userAuthDatabase = new Database({ url: arangoUrl, databaseName: 'UserAuth' })
  const arangoContentGraphAdditionalGQLResolvers = graphqlArangoContentGraphResolvers(contentGraphDatabase)

  const jwtVerifyOpts: VerifyOptions = {
    algorithms: ['RS256'],
  }
  const jwtSignOptions: SignOptions = {
    algorithm: 'RS256',
    expiresIn: jwtExpirationSecs,
  }

  const graphqlApp = createGraphQLApp({
    additionalResolvers: { ...arangoContentGraphAdditionalGQLResolvers },
    jwtPrivateKey,
    jwtSignOptions,
  })

  /* const expressApp = */ await startMNHttpServer({
    httpPort,
    startServices: { graphql: graphqlApp },
    jwtPublicKey,
    jwtVerifyOpts,
  })

  /// deploy

  open(nodePorts.byId, getNodeByIdAdapter(contentGraphDatabase))

  open(searchPorts.byTerm, globalSearch(contentGraphDatabase))

  open(userPorts.getActiveByUsername, {
    ...byUsername(userAuthDatabase),
    verifyPassword: argonVerifyPassword(),
  })

  open(newUserports.signUp, {
    ...storeNewSignupRequest(userAuthDatabase),
    publicBaseUrl,
    generateToken: async () => ulid(),
    sendEmail: emailSender.sendEmail,
  })

  open(newUserports.confirmSignup, {
    ...activateNewUser(userAuthDatabase),
    hashPassword: (plain: string) => argonHashPassword({ pwd: plain }),
    generateNewProfileId: async () => {
      const profileKey = ulidKey()
      const profileId = makeId('Profile', profileKey)
      return profileId
    },
    createNewProfile: async ({ profileId, username }) => {
      const ctx = getSystemExecutionContext({})
      return resolve(
        nodePorts.create<'Profile'>({
          ctx,
          data: { name: username, summary: '' },
          nodeType: 'Profile',
          key: idKeyFromId(profileId),
        }),
      )().then(console.log, console.error)
    },
  })

  open(nodePorts.create, createNodeAdapter(contentGraphDatabase))

  open(edgePorts.create, createEdgeAdapter(contentGraphDatabase))
  open(edgePorts.del, deleteEdgeAdapter(contentGraphDatabase))
}
