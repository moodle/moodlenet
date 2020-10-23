import { Domain } from '@mn-be/domain/DomainTypes'
import { DomainTransport, MsgTransport } from './DomainTransportTypes'

export const domainTransport = <D extends Domain>({
  domain,
  msgT,
}: {
  domain: D['name']
  msgT: MsgTransport<D>
}): DomainTransport<D> => {
  const pub: DomainTransport<D>['pub'] = ({ type, payload }) =>
    msgT.pub({
      domain,
      type,
      payload,
    })

  const sub: DomainTransport<D>['sub'] = (_) => msgT.sub({ ..._, domain })
  const apiReq: DomainTransport<D>['apiReq'] = (_) => msgT.apiReq({ ..._, domain })
  const apiRes: DomainTransport<D>['apiRes'] = (_) => msgT.apiRes({ ..._, domain })
  const subApiReq: DomainTransport<D>['subApiReq'] = (_) => msgT.subApiReq({ ..._, domain })
  const subApiRes: DomainTransport<D>['subApiRes'] = (_) => msgT.subApiRes({ ..._, domain })

  return {
    pub,
    sub,
    apiReq,
    apiRes,
    subApiReq,
    subApiRes,
  }
}
