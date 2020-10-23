import {
  ApiReq,
  ApiRes,
  Domain,
  DomainApiMap,
  DomainEvtMap,
  DomainName,
} from '@mn-be/domain/DomainTypes'

export type EventId = string

export type DomainEvent<D extends Domain, Type extends keyof DomainEvtMap<D>> = {
  domain: DomainName<D>
  type: Type
  payload: DomainEvtMap<D>[Type]
}

export type IdentifiedDomainEvent<
  D extends Domain,
  Type extends keyof DomainEvtMap<D>
> = DomainEvent<D, Type> & {
  id: EventId
}

export type DomainUnsub = () => unknown

export interface MsgTransport<D extends Domain> {
  pub<Type extends keyof DomainEvtMap<D>>(_: DomainEvent<D, Type>): IdentifiedDomainEvent<D, Type>

  sub<Type extends keyof DomainEvtMap<D>>(_: {
    domain: DomainName<D>
    type: Type
    handler: (evt: IdentifiedDomainEvent<D, Type>) => unknown
  }): DomainUnsub

  api<ApiName extends keyof DomainApiMap<D>>(_: {
    domain: DomainName<D>
    apiName: ApiName
    req: ApiReq<D, ApiName>
  }): ApiRes<D, ApiName>

  apiReq<ApiName extends keyof DomainApiMap<D>>(_: {
    domain: DomainName<D>
    apiName: ApiName
    req: ApiReq<D, ApiName>
  }): EventId

  apiRes<ApiName extends keyof DomainApiMap<D>>(_: {
    domain: DomainName<D>
    apiName: ApiName
    id: EventId
    res: ApiRes<D, ApiName>
  }): unknown

  subApiReq<ApiName extends keyof DomainApiMap<D>>(_: {
    domain: DomainName<D>
    apiName: ApiName
    handler: (req: ApiReq<D, ApiName>, id: EventId) => unknown
  }): DomainUnsub

  subApiRes<ApiName extends keyof DomainApiMap<D>>(_: {
    domain: DomainName<D>
    apiName: ApiName
    id: EventId
    handler: (res: ApiRes<D, ApiName>, id: EventId) => unknown
  }): DomainUnsub
}

export interface DomainTransport<D extends Domain> {
  pub<Type extends keyof DomainEvtMap<D>>(
    _: Omit<DomainEvent<D, Type>, 'domain'>
  ): IdentifiedDomainEvent<D, Type>

  sub<Type extends keyof DomainEvtMap<D>>(_: {
    type: Type
    handler: (evt: IdentifiedDomainEvent<D, Type>) => unknown
  }): DomainUnsub

  api<ApiName extends keyof DomainApiMap<D>>(_: {
    apiName: ApiName
    req: ApiReq<D, ApiName>
  }): ApiRes<D, ApiName>

  apiReq<ApiName extends keyof DomainApiMap<D>>(_: {
    apiName: ApiName
    req: ApiReq<D, ApiName>
  }): EventId

  apiRes<ApiName extends keyof DomainApiMap<D>>(_: {
    apiName: ApiName
    id: EventId
    res: ApiRes<D, ApiName>
  }): unknown

  subApiReq<ApiName extends keyof DomainApiMap<D>>(_: {
    apiName: ApiName
    handler: (req: ApiReq<D, ApiName>, id: EventId) => unknown
  }): DomainUnsub

  subApiRes<ApiName extends keyof DomainApiMap<D>>(_: {
    apiName: ApiName
    id: EventId
    handler: (res: ApiRes<D, ApiName>, id: EventId) => unknown
  }): DomainUnsub
}
