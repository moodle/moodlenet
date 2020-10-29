import Yup from 'yup'

export interface Env {
  mongoUrl: string
}

const DB_URL = process.env.EMAIL_DB_URL // Mongodb URL for Email Services

const Validator = Yup.object<Env>({
  mongoUrl: Yup.string().url().required(),
})

const env = Validator.validateSync({
  mongoUrl: DB_URL,
})

export default env!
