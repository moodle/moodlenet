import { MoodleNetDomain } from '../../domain/MoodleNetDomain'
import { Domain, DomainName } from './types'

export const p = <Dom extends Domain>(domainName: DomainName<Dom>) => {
  return crawl<Dom>(domainName)
}
function crawl<X>(_: string) {
  return <P extends keyof X>(p: P) => crawl<X[P]>(`${_}.${p}`)
}
const g = p<MoodleNetDomain>('MoodleNet')('services')('Accounting')('wf')('RegisterNewAccount')(
  'start'
)
