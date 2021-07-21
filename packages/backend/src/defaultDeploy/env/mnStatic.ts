import { validateDomainString } from '@moodlenet/common/lib/utils/general'
import { MNStaticEnv } from '../../lib/types'

const domain = process.env.DOMAIN || ''
if (!validateDomainString(domain)) {
  throw new Error(`some env missing or invalid`)
}

const mnStatic: MNStaticEnv = {
  domain,
}

export default mnStatic
