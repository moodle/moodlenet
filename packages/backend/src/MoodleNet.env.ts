import { memo } from '@moodlenet/common/lib/utils/misc'
import * as Yup from 'yup'

const PUBLIC_URL = process.env.PUBLIC_URL

export const getMNEnv = memo(() => {
  const publicBaseUrl = Yup.string().required().validateSync(PUBLIC_URL) // TODO:  in RootValue ?
  return {
    publicBaseUrl,
  }
})
