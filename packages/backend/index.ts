require('./env')
import { startDefaultMoodlenet } from './src/MoodleNetDomain/defaultDeploy'

const mailgunApiKey = process.env.MAILGUN_API_KEY
const mailgunDomain = process.env.MAILGUN_DOMAIN
const arangoUrl = process.env.ARANGO_HOST
if (!(arangoUrl && mailgunApiKey && mailgunDomain)) {
  throw new Error(`missing env`)
}

startDefaultMoodlenet({ arangoUrl, mailgunApiKey, mailgunDomain })
