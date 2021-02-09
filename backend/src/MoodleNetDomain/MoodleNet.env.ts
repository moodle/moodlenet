import * as Yup from 'yup'
import { once } from '../lib/helpers/misc'

const MN_PUBLIC_BASE_URL = process.env.MN_PUBLIC_BASE_URL

export const getMNEnv = once(() => {
  const publicBaseUrl = Yup.string().required().validateSync(MN_PUBLIC_BASE_URL)
  return {
    publicBaseUrl,
  }
})
