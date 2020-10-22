import { Domain } from '@mn-be/domain/types'
import { DomainTransport, MsgTransport } from './types'

export const domainTransport = <D extends Domain>({
  domain,
  msgT,
}: {
  domain: D['name']
  msgT: MsgTransport<D>
}): DomainTransport<D> => {
  const pub: DomainTransport<D>['pub'] = (type, payload) =>
    msgT.pub({
      domain,
      type,
      payload,
    })

  const sub: DomainTransport<D>['sub'] = (type, handler) => msgT.sub(domain, type, handler)
  const api: DomainTransport<D>['api'] = (apiName, arg) => msgT.api(domain, apiName, arg)
  return {
    pub,
    sub,
    api,
  }
}
