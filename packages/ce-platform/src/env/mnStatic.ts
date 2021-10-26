import { validateDomainString } from '@moodlenet/common/lib/utils/general'

const domain = process.env.DOMAIN || ''
if (!validateDomainString(domain)) {
  throw new Error(`some env missing or invalid`)
}
const customHead = process.env.REACT_APP_CUSTOM_HEAD

const mnStatic = {
  domain,
  customHead,
}

export default mnStatic
