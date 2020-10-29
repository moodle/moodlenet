import Yup from 'yup'
type Env = {
  apiKey: string
  domain: string
}

const MAILGUN_API_KEY = process.env.EMAIL_MAILGUN_API_KEY
const MAILGUN_DOMAIN = process.env.EMAIL_MAILGUN_DOMAIN

const Validator = Yup.object<Env>({
  apiKey: Yup.string().required(),
  domain: Yup.string().url().required(),
})

const env = Validator.validateSync({
  apiKey: MAILGUN_API_KEY,
  domain: MAILGUN_DOMAIN,
})

export default env!
