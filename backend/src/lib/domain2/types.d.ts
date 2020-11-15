export type Domain = {
  name: string
  services: {
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

// TODO: think of a good meta
export type WFMeta = {
  id: string
  // enqueuedAt:Date
  // startedAt:Date
}

type ID = string
export type DomainWfMessageContent<P> = [payload: P]
export type DomainEventMessageContent<P> = [payload: P]
export type DomainMessageContent<P> = DomainEventMessageContent<P> | DomainWfMessageContent<P>

export type WorkflowStartParams<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
> = Workflow<D, S, W>['start']

export type WFLifeCycle = 'progress' | 'end'
export type WFStatus = 'progress' | 'end' | 'enqueued'
export type WFState<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>,
  Status extends WFStatus = WFStatus
> = {
  id: string
  status: Status
  updated: Date
  started: Date
  startParams: WorkflowStartParams<D, S, W>
} & (Status extends 'progress' | 'end'
  ? {
      ctx: WorkflowContext<D, S, W>
      progress: Status extends 'end'
        ? WorkflowEnd<D, S, W, TopicWildCard>
        : WorkflowProgress<D, S, W, TopicWildCard>
    }
  : {})

export type DomainPersistence = {
  getWFState<D extends Domain, S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(_: {
    id: string
  }): Promise<WFState<D, S, W, WFStatus>>

  progressWF<D extends Domain, S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(_: {
    id: string
    progress: WorkflowEnd<D, S, W, TopicWildCard>
    ctx?: WorkflowContext<D, S, W>
  }): Promise<WFState<D, S, W, 'progress'>>

  enqueueWF<D extends Domain, S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(_: {
    id: string
    startParams: WorkflowStartParams<D, S, W>
    ctx: WorkflowContext<D, S, W>
  }): Promise<WFState<D, S, W, 'enqueued'>>

  endWF<D extends Domain, S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(_: {
    id: string
    endProgress: WorkflowEnd<D, S, W, TopicWildCard>
    ctx?: WorkflowContext<D, S, W>
  }): Promise<WFState<D, S, W, 'end'>>
}

export type TopicWildCard = '*' //| '#'
export type ServiceNames<D extends Domain> = keyof D['services']
export type ServiceByName<D extends Domain, S extends ServiceNames<D>> = D['services'][S]

export type WorkflowNames<
  D extends Domain,
  S extends ServiceNames<D>
> = keyof D['services'][S]['wf']

export type WorkflowProgressNames<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
> = keyof WorkflowProgressMap<D, S, W>
export type WorkflowProgressPayload<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>,
  Name extends WorkflowProgressNames<D, S, W>
> = Workflow<D, S, W>['progress'][Name]

export type WorkflowEndNames<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
> = keyof WorkflowEndMap<D, S, W>
export type WorkflowEndPayload<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>,
  Name extends WorkflowEndNames<D, S, W>
> = Workflow<D, S, W>['end'][Name]

//  type SignalNames<
//   D extends Domain,
//   S extends ServiceNames<D>,
//   WF extends WorkflowNames<D, S>
//   > = keyof Workflow<D, S, WF>['signal']

export type Workflow<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
> = D['services'][S]['wf'][W]

export type WorkflowProgressMap<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
> = Workflow<D, S, W>['progress']

export type WorkflowEndMap<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
> = Workflow<D, S, W>['end']

export type TypeUnion<T> = keyof T extends infer P // Introduce an extra type parameter P to distribute over
  ? P extends keyof T
    ? { payload: T[P]; type: P } // Take each P and create the union member
    : never
  : never

//  type WorkflowEndFn<
//   D extends Domain,
//   S extends ServiceNames<D>,
//   W extends WorkflowNames<D, S>
//   > = (end: WorkflowEndProgress<D, S, W>, ctx?: WorkflowContext<D, S, W>) => unknown

export type WorkflowProgress<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>,
  ProgrName extends TopicWildCard | WorkflowProgressNames<D, S, W>
> = ProgrName extends TopicWildCard
  ? TypeUnion<WorkflowProgressMap<D, S, W>>
  : { payload: WorkflowProgressMap<D, S, W>[ProgrName]; type: ProgrName; id: string }

export type WorkflowEnd<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>,
  EndName extends TopicWildCard | WorkflowEndNames<D, S, W>
> = EndName extends TopicWildCard
  ? TypeUnion<WorkflowEndMap<D, S, W>>
  : { payload: WorkflowEndMap<D, S, W>[EndName]; type: EndName; id: string }

// type WorkflowAnyProgress<
//   D extends Domain,
//   S extends ServiceNames<D>,
//   W extends WorkflowNames<D, S>
// > = WorkflowEnd<D, S, W, TopicWildCard> | WorkflowProgress<D, S, W, TopicWildCard>

//  type WorkflowSignalMap<
//   D extends Domain,
//   S extends ServiceNames<D>,
//   W extends WorkflowNames<D, S>
//   > = Workflow<D, S, W>['signal']

//  type SignalPayload<
//   D extends Domain,
//   S extends ServiceNames<D>,
//   W extends WorkflowNames<D, S>,
//   Sig extends TopicWildCard | SignalNames<D, S, W>
//   > = Sig extends TopicWildCard
//   ? TypeUnion<WorkflowSignalMap<D, S, W>>
//   : WorkflowSignalMap<D, S, W>[Sig] & { _type: Sig }

export type WorkflowContext<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
> = Workflow<D, S, W>['ctx']

//  type EventPayload<
//   D extends Domain,
//   S extends ServiceNames<D>,
//   E extends TopicWildCard | EventNames<D, S>
//   > = E extends TopicWildCard
//   ? TypeUnion<D['services'][S]['ev']>
//   : D['services'][S]['ev'][E] & { _type: E }

type EventNames<D extends Domain, S extends ServiceNames<D>> = keyof D['services'][S]['ev']
export type EventPayload<
  D extends Domain,
  S extends ServiceNames<D>,
  E extends EventNames<D, S> = EventNames<D, S>
> = D['services'][S]['ev'][E]
