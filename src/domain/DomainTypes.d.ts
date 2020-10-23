export type EventTypeMap = {
  [eventType: string]: any
}
export type DomainsName = string //'Email' | 'Account'
export type ApisDir = {
  [apiName in string]: [Req: any, Res: any]
}

export type ApiReq<D extends Domain, Name extends keyof DomainApisDir<D>> = DomainApisDir<D>[Name][0]
export type ApiRes<D extends Domain, Name extends keyof DomainApisDir<D>> = DomainApisDir<D>[Name][1]

export interface Domain<
  Name extends DomainsName = DomainsName,
  ETM extends EventTypeMap = any,
  Apis extends ApisDir = any
> {
  name: Name
  events: ETM &
    {
      [apiName in keyof Apis]: {
        req: Apis[apiName][0]
        res: Apis[apiName][1]
      }
    }
  apis: Apis
}
export type DomainName<D extends Domain>=D['name']
export type DomainApisDir<D extends Domain>=D['apis']

export type DomainApiMap<D extends Domain<DomainsName, any, any>> = D extends Domain<
  DomainsName,
  any,
  infer Apis
>
  ? {
      [apiName in keyof Apis]: (arg: ApiReq<D,apiName>) => Promise<ApiRes<D,apiName>>
    }
  : never

export type DomainEvtMap<D> = D extends Domain<DomainsName, any, any> ? D['events'] : never
export type DomainEvtPayloadType<
  D extends Domain<DomainsName, any, any>,
  Type extends keyof DomainEvtMap<D> = DomainEvtMap<D>
> = DomainEvtMap<D>[Type]
