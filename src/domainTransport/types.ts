import { Domain, DomainApiMap, DomainEvtMap, DomainEvtPayloadType } from '@mn-be/domain/types'

type EventId = any

export type DomainEvent<D extends Domain, Type extends keyof DomainEvtMap<D>> = {
  domain: D['name']
  type: Type
  payload: DomainEvtMap<D>[Type]
}

export type IdentifiedDomainEvent<
  D extends Domain,
  Type extends keyof DomainEvtMap<D>
> = DomainEvent<D, Type> & {
  id: EventId
}

export interface MsgTransport<D extends Domain> {
  pub<Type extends keyof DomainEvtMap<D>>(
    event: DomainEvent<D, Type>
  ): IdentifiedDomainEvent<D, Type>
  sub<Type extends keyof DomainEvtMap<D>>(
    domain: D['name'],
    type: Type,
    handler: (evt: IdentifiedDomainEvent<D, Type>) => unknown
  ): DomainUnsub
  api<ApiName extends keyof DomainApiMap<D>>(
    domain: D['name'],
    apiName: ApiName,
    arg: Parameters<DomainApiMap<D>[ApiName]>[0]
  ): ReturnType<DomainApiMap<D>[ApiName]>
}

export type DomainUnsub = () => unknown

export type DomainTransport<D extends Domain> = {
  pub<Type extends keyof DomainEvtMap<D>>(
    type: Type,
    payload: DomainEvtPayloadType<D, Type>
  ): IdentifiedDomainEvent<D, Type>
  sub<Type extends keyof DomainEvtMap<D>>(
    type: Type,
    handler: (evt: IdentifiedDomainEvent<D, Type>) => unknown
  ): DomainUnsub
  api<Name extends keyof DomainApiMap<D>>(
    name: Name,
    arg: Parameters<DomainApiMap<D>[Name]>[0]
  ): ReturnType<DomainApiMap<D>[Name]>
}
