import { Concat } from 'typescript-tuple'

export type Domain = {
  name: string
  srv: {
    [service in string]: DomainService
  }
}
export type DomainName<D extends Domain> = D['name']

export type DomainService = {
  wf: {
    [workflow in string]: ServiceWorkflow
  }
  ev: {
    [signalType in string]: any
  }
}

export type ServiceWorkflow = {
  ctx: any
  start: any
  progress: {
    [progressName in string]: any
  }
  end: {
    [endName in string]: any
  }
  signal: {
    [signalType in string]: any
  }
}

type WFLifePayload<
  D extends Domain,
  S extends keyof D['srv'],
  W extends keyof D['srv'][S]['wf'],
  Act extends 'progress' | 'end' | 'signal',
  Name extends '*' | keyof D['srv'][S]['wf'][W][Act] = keyof D['srv'][S]['wf'][W][Act]
> = WildTypeUnion<D['srv'][S]['wf'][W][Act], Name>

type WFStartType<
  D extends Domain,
  S extends keyof D['srv'],
  W extends keyof D['srv'][S]['wf']
> = D['srv'][S]['wf'][W]['start']

type WFCtxType<
  D extends Domain,
  S extends keyof D['srv'],
  W extends keyof D['srv'][S]['wf']
> = D['srv'][S]['wf'][W]['ctx']

export type TypeUnion<T, K extends keyof T = keyof T> = K extends infer P
  ? P extends K
    ? { t: P; p: T[P] }
    : never
  : never

export type WildTypeUnion<T, K extends '*' | keyof T = keyof T> = K extends keyof T
  ? TypeUnion<T, K>
  : TypeUnion<T, keyof T>

export type Pointer<
  Path extends PathTo.Any,
  Type /* extends ParentType[Name] */,
  ParentType,
  KeyName extends keyof ParentType | '*',
  D extends Domain
> = {
  path: Path
  keyName: KeyName
  type: Type
  parentType: ParentType
  payload: WildTypeUnion<ParentType, KeyName>
  domain: D
}
export type NoWildPointer<
  Point extends Pointer<PathTo.AnyLeaf, any, any, any, any>
> = Point['keyName'] extends '*' ? never : Point

// prettier-ignore
export namespace PathTo {
  export type P1<A> = [A]
  export type P2<A, B> = [A, B]
  export type P3<A, B, C> = [A, B, C]
  export type P4<A, B, C, D extends 'ev'|'wf'>                                                             = [A, B, C, D]
  export type P5<A, B, C, D extends 'ev'|'wf', E>                                                          = [A, B, C, D, E]
  export type P6<A, B, C, D extends 'wf',      E, F extends 'start'|'progress'|'signal'|'end'>             = [A, B, C, D, E, F]
  export type P7<A, B, C, D extends 'wf',      E, F extends 'start'|'progress'|'signal'|'end', G>          = [A, B, C, D, E, F, G]
  export type P8<A, B, C, D extends 'wf',      E, F extends 'start'|'progress'|'signal'|'end', G, H>       = [A, B, C, D, E, F, G, H]
  
  export type Event =       P5<string, string, string, 'ev', string>
  export type WFStart =     P6<string, string, string, 'wf', string, 'start'>
  export type WFEnd =       P7<string, string, string, 'wf', string, 'end', string>
  export type WFProgress =  P7<string, string, string, 'wf', string, 'progress', string>
  export type WFSignal =    P7<string, string, string, 'wf', string, 'signal', string>
  export type WF=
  | WFStart
  | WFLife
  export type WFLife=
  | WFEnd
  | WFProgress
  | WFSignal
  
  export type WFLifeId=Concat<
  | WFEnd
  | WFProgress
  | WFSignal
  ,[string]>
  
  export type AnyLeaf = 
    | Event
    | WF

  export type Any =
    | P1<string>
    | P2<string, string>
    | P3<string, string, string>
    | P4<string, string, string, 'ev'|'wf'>
    | P5<string, string, string, 'ev'|'wf', string>
    | P6<string, string, string, 'wf',      string, 'start'|'progress'|'signal'|'end'>
    | P7<string, string, string, 'wf',      string, 'start'|'progress'|'signal'|'end', string>
    // | P8<string, string, string, 'wf',      string, 'start'|'progress'|'signal'|'end', string, string>
   // | AnyLeaf
}

export type WFStatus = 'progress' | 'end' | 'enqueued'

export type WFState<
  D extends Domain,
  S extends keyof D['srv'],
  W extends keyof D['srv'][S]['wf'],
  Status extends WFStatus = WFStatus
> = {
  id: string
  domain: DomainName<D>
  srv: S
  wf: W
  status: Status
  updated: Date
  started: Date
  startParams: WFStartType<D, S, W>
} & (Status extends 'progress' | 'end'
  ? {
      ctx: WFCtxType<D, S, W>
      progress: WFLifePayload<D, S, W, Status>
    }
  : {})

// TODO usare Pointer come type-argument
export type DomainPersistence = {
  getWFState<D extends Domain, S extends keyof D['srv'], W extends keyof D['srv'][S]['wf']>(_: {
    id: string
  }): Promise<WFState<D, S, W, WFStatus>>

  getWFStateX<D extends Domain, S extends keyof D['srv'], W extends keyof D['srv'][S]['wf']>(_: {
    id: string
  }): Promise<WFState<D, S, W, WFStatus>>

  progressWF<D extends Domain, S extends keyof D['srv'], W extends keyof D['srv'][S]['wf']>(_: {
    id: string
    progress: WFLifePayload<D, S, W, 'progress'>
    ctx?: WFCtxType<D, S, W>
  }): Promise<WFState<D, S, W, 'progress'>>

  enqueueWF<D extends Domain, S extends keyof D['srv'], W extends keyof D['srv'][S]['wf']>(_: {
    id: string
    startParams: WFStartType<D, S, W>
  }): Promise<WFState<D, S, W, 'enqueued'>>

  endWF<D extends Domain, S extends keyof D['srv'], W extends keyof D['srv'][S]['wf']>(_: {
    id: string
    endProgress: WFLifePayload<D, S, W, 'end'>
    ctx?: WFCtxType<D, S, W>
  }): Promise<WFState<D, S, W, 'end'>>
}
