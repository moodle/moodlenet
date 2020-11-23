export type Domain = {
  name: string
  srv: {
    [service in string]: DomainService
  }
}
export namespace Domain {
  export type Name<D extends Domain> = D['name']
}

export type DomainService = {
  wf: {
    [workflow in string]: ServiceWorkflow
  }
  api: {
    [apiType in string]: [req: any, res: any]
  }
  ev: {
    [signalType in string]: any
  }
}
export type ServiceWorkflow = {
  ctx: any
  start: any
  progress?: {
    [progressName in string]: any
  }
  end: {
    [endName in string]: any
  }
  signal: {
    [signalType in string]: any
  }
}

// export type CallableType<C, Side extends 'in' | 'out'> = C extends Callable<infer In, infer Out>
//   ? Side extends 'in'
//     ? In
//     : Out
//   : never

export type Route<Dom extends Domain, Srv extends keyof Dom['srv'], Sect extends 'wf' | 'ev'> = {
  dom: Dom['name']
  srv: Srv
  sect: Sect
}

export namespace Workflow {
  export type Route<
    Dom extends Domain,
    Srv extends keyof Dom['srv'],
    Wf extends keyof Dom['srv'][Srv]['wf']
  > = { dom: Dom['name']; srv: Srv; wf: Wf }

  export type RouteId<
    Dom extends Domain,
    Srv extends keyof Dom['srv'],
    Wf extends keyof Dom['srv'][Srv]['wf']
  > = { dom: Dom['name']; srv: Srv; wf: Wf; id: string }

  export type RouteSignalIn<
    Dom extends Domain,
    Srv extends keyof Dom['srv'],
    Wf extends keyof Dom['srv'][Srv]['wf'],
    SigName extends keyof Dom['srv'][Srv]['wf'][Wf]['signal'],
    $ = Dom['srv'][Srv]['wf'][Wf]['signal'][SigName]
  > = RouteId<Dom, Srv, Wf> & { sig: SigName; $: $ }

  export type StartType<
    Dom extends Domain,
    Srv extends keyof Dom['srv'],
    Wf extends keyof Dom['srv'][Srv]['wf']
  > = Dom['srv'][Srv]['wf'][Wf]['start']

  export type LifeTypeUnion<
    Dom extends Domain,
    Srv extends keyof Dom['srv'],
    Wf extends keyof Dom['srv'][Srv]['wf'],
    WfStage extends 'progress' | 'end' | 'signal',
    StageName extends
      | '*'
      | keyof Dom['srv'][Srv]['wf'][Wf][WfStage] = keyof Dom['srv'][Srv]['wf'][Wf][WfStage],
    Union extends WildTypeUnion<Dom['srv'][Srv]['wf'][Wf][WfStage], StageName> = WildTypeUnion<
      Dom['srv'][Srv]['wf'][Wf][WfStage],
      StageName
    >
  > = Union extends { t: infer T; p: [infer P, any] } ? { t: T; p: P } : never

  export type ReplyTypeUnion<
    Dom extends Domain,
    Srv extends keyof Dom['srv'],
    Wf extends keyof Dom['srv'][Srv]['wf'],
    Section extends 'progress' | 'end' | 'signal',
    SectionName extends
      | '*'
      | keyof Dom['srv'][Srv]['wf'][Wf][Section] = keyof Dom['srv'][Srv]['wf'][Wf][Section],
    Union extends WildTypeUnion<Dom['srv'][Srv]['wf'][Wf][Section], SectionName> = WildTypeUnion<
      Dom['srv'][Srv]['wf'][Wf][Section],
      SectionName
    >
  > = Union extends { t: infer T; p: [any, infer P] } ? { t: T; p: P } : never
}

export type TypeUnion<Hash, Prop extends keyof Hash = keyof Hash> = Prop extends infer Type
  ? Type extends Prop
    ? { t: Type; p: Hash[Type] }
    : never
  : never

export type WildTypeUnion<
  Hash,
  Prop extends '*' | keyof Hash = keyof Hash
> = Prop extends keyof Hash ? TypeUnion<Hash, Prop> : TypeUnion<Hash, keyof Hash>
