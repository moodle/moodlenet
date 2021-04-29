import * as Yup from 'yup'
import { memo } from '../lib/helpers/misc'

const PUBLIC_URL = process.env.PUBLIC_URL

export const getMNEnv = memo(() => {
  const publicBaseUrl = Yup.string().required().validateSync(PUBLIC_URL) // TODO:  in RootValue ?
  return {
    publicBaseUrl,
  }
})
