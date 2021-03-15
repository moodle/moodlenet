require('./env')
import { startDefaultMoodlenet } from './src/MoodleNetDomain/defaultDeploy'
import { starthttpGateway } from './src/MoodleNetDomain/services/GraphQLHTTPGateway/GraphQLHTTPGateway'

const httpGqlPort = Number(process.env.HTTP_GRAPHQL_PORT) || 8080
const mailgunApiKey = process.env.MAILGUN_API_KEY
const mailgunDomain = process.env.MAILGUN_DOMAIN
const arangoUrl = process.env.ARANGO_HOST
if (!(arangoUrl && mailgunApiKey && mailgunDomain)) {
  throw new Error(`missing env`)
}
starthttpGateway({ port: httpGqlPort })
startDefaultMoodlenet({ arangoUrl, mailgunApiKey, mailgunDomain })
