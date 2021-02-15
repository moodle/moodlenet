import * as Yup from 'yup'
import { once } from '../lib/helpers/misc'

const PUBLIC_URL = process.env.PUBLIC_URL

export const getMNEnv = once(() => {
  const publicBaseUrl = Yup.string().required().validateSync(PUBLIC_URL)
  return {
    publicBaseUrl,
  }
})
