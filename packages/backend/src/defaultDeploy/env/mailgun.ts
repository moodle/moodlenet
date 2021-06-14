const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN

if (!(MAILGUN_API_KEY && MAILGUN_DOMAIN)) {
  console.error('Mailgun Env:')
  console.log({ MAILGUN_API_KEY, MAILGUN_DOMAIN })
  throw new Error(`some env missing or invalid`)
}

const mailgunenv = {
  apiKey: MAILGUN_API_KEY,
  domain: MAILGUN_DOMAIN,
}

export type MailgunEnv = typeof mailgunenv

export default mailgunenv
