export type EventTypeMap = {
  [eventType: string]: any
}
export type DomainName = string //'Email' | 'Account'
export type ApiMap = {
  [api in string]: (req: any) => any
}
export interface Domain<
  Name extends DomainName = DomainName,
  ETM extends EventTypeMap = any,
  Api extends ApiMap = any
> {
  name: Name
  events: ETM &
    {
      [apiName in keyof Api]: {
        request: Parameters<Api[apiName]>[0]
        response: ReturnType<Api[apiName]>
      }
    }
  apis: Api
}

export type DomainApiMap<D extends Domain<DomainName, any, any>> = D extends Domain<
  DomainName,
  any,
  infer Apis
>
  ? {
      [apiName in keyof Apis]: (
        args: Parameters<Apis[apiName]>[0]
      ) => ReturnType<Apis[apiName]> | Promise<ReturnType<Apis[apiName]>>
    }
  : never

export type DomainEvtMap<D> = D extends Domain<DomainName, any, any> ? D['events'] : never
export type DomainEvtPayloadType<
  D extends Domain<DomainName, any, any>,
  Type extends keyof DomainEvtMap<D> = DomainEvtMap<D>
> = DomainEvtMap<D>[Type]
