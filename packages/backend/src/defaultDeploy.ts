import { makeId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { Database } from 'arangojs'
import { SignOptions, VerifyOptions } from 'jsonwebtoken'
import SshPK from 'sshpk'
import { ulid } from 'ulid'
import * as Yup from 'yup'
import { graphqlArangoContentGraphResolvers } from './adapters/content-graph/arangodb/graphql/additional-resolvers'
import { globalSearch } from './adapters/content-graph/arangodb/queries/globalSearch'
import { getNodeByIdArangoAdapter } from './adapters/content-graph/arangodb/queries/node'
import { createGraphQLApp } from './adapters/http/graphqlApp'
import { startMNHttpServer } from './adapters/http/MNHTTPServer'
import { argonHashPassword, argonVerifyPassword } from './adapters/lib/auth/argon'
import { activateNewUser, storeNewSignupRequest } from './adapters/user-auth/arangodb/mutations/new-user'
import { byUsername } from './adapters/user-auth/arangodb/queries/session'
import { ulidKey } from './lib/helpers/arango'
import { deploy } from './lib/qmino'
import { createMailgunSender } from './lib/sendersImpl/mailgun/mailgunSender'
import { newUserConfirm, signUp } from './ports/mutations/user-auth/new-user'
import { byId } from './ports/queries/content-graph/get-content-node'
import { search } from './ports/queries/content-graph/global-search'
import { getByUsername } from './ports/queries/user-auth/session'

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
  const tokenGenerator = async () => ulid()
  const generateProfileId = async () => {
    const profileKey = ulidKey()
    const profileId = makeId('Profile', profileKey)
    return profileId
  }
  const hashPassword = (plain: string) => argonHashPassword({ pwd: plain })

  /// deploy

  deploy(byId, getNodeByIdArangoAdapter(contentGraphDatabase))
  deploy(search, globalSearch(contentGraphDatabase))
  deploy(getByUsername, byUsername(userAuthDatabase, argonVerifyPassword))
  deploy(
    signUp,
    storeNewSignupRequest(userAuthDatabase, {
      publicBaseUrl,
      generateToken: tokenGenerator,

      sendEmail: emailSender.sendEmail,
    }),
  )
  deploy(
    newUserConfirm,
    activateNewUser(userAuthDatabase, {
      hashPassword,
      generateProfileId,
    }),
  )
}
