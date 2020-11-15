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

export type Pointer<P extends PathTo.Any, T> = {
  p: P
  _: T
  // _: {t:Last<P> extends '*' ? keyof P:Last<P>, p: T}
}
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
    | WFEnd
    | WFProgress
    | WFSignal
  
    
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
