import { validateDomainString } from '@moodlenet/common/lib/utils/general'

const domain = process.env.DOMAIN || ''
if (!validateDomainString(domain)) {
  throw new Error(`some env missing or invalid`)
}

const mnStatic = {
  domain,
}

export default mnStatic
