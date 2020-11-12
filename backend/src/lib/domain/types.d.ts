export type Payload = any
export type Progress = any
export type End = any
export type StrName = Exclude<string, TopicWildCard>

export type Domain = {
  name: string
  services: {
    [service in StrName]: DomainService
  }
}

export type DomainService = {
  wf: {
    [workflow in StrName]: ServiceWorkflow
  }
  ev: {
    [signalType in StrName]: Payload
  }
}

export type ServiceWorkflow = {
  ctx: Payload
  start: Payload
  progress: {
    [progressName in StrName]: Progress
  }
  end: {
    [endName in StrName]: End
  }
  signal: {
    [signalType in StrName]: Payload
  }
}

// TODO: think of a good meta
export type WFMeta = {
  id: string
  // enqueuedAt:Date
  // startedAt:Date
}

export type DomainWFMessageBase = {
  id: string
}
export type DomainWFStartMessage<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
  > = DomainWFMessageBase & {
    startParams: WorkflowStartParams<D, S, W>
  }
export type DomainWFProgressMessage<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
  > = DomainWFMessageBase & {
    progress: WorkflowProgress<D, S, W>
  }
export type DomainWFEndMessage<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
  > = DomainWFMessageBase & {
    endProgress: WorkflowEndProgress<D, S, W>
  }
export type DomainWFMessage<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
  > = DomainWFProgressMessage<D, S, W> | DomainWFEndMessage<D, S, W>

export type AnyDomainWFMessage<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>,
  > = DomainWFMessage<D, S, W> | DomainWFStartMessage<D, S, W>

export type TopicWildCard = '*' //| '#'
export type DomainName<D extends Domain> = D['name']
export type ServiceNames<D extends Domain> = keyof D['services']

export type WorkflowNames<
  D extends Domain,
  S extends ServiceNames<D>
  > = keyof D['services'][S]['wf']

export type SignalNames<
  D extends Domain,
  S extends ServiceNames<D>,
  WF extends WorkflowNames<D, S>
  > = keyof Workflow<D, S, WF>['signal']

export type Workflow<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
  > = D['services'][S]['wf'][W]

export type WorkflowStartParams<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
  > = Workflow<D, S, W>['start']

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
  ? T[P] & { _type: P } // Take each P and create the union member
  : never
  : never

export type WorkflowEndFn<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
  > = (end: WorkflowEndProgress<D, S, W>, ctx?: WorkflowContext<D, S, W>) => unknown

export type WorkflowProgress<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
  > = TypeUnion<WorkflowProgressMap<D, S, W>>

export type WorkflowEndProgress<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
  > = TypeUnion<WorkflowEndMap<D, S, W>>

export type WorkflowAnyProgress<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
  > = WorkflowEndProgress<D, S, W> | WorkflowProgress<D, S, W>

export type WorkflowSignalMap<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
  > = Workflow<D, S, W>['signal']

export type SignalPayload<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>,
  Sig extends TopicWildCard | SignalNames<D, S, W>
  > = Sig extends TopicWildCard
  ? TypeUnion<WorkflowSignalMap<D, S, W>>
  : WorkflowSignalMap<D, S, W>[Sig] & { _type: Sig }

export type WorkflowContext<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
  > = Workflow<D, S, W>['ctx']

export type EventPayload<
  D extends Domain,
  S extends ServiceNames<D>,
  E extends TopicWildCard | EventNames<D, S>
  > = E extends TopicWildCard
  ? TypeUnion<D['services'][S]['ev']>
  : D['services'][S]['ev'][E] & { _type: E }

export type EventNames<D extends Domain, S extends ServiceNames<D>> = keyof D['services'][S]['ev']

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
    updated: Date,
    started: Date,
    startParams: WorkflowStartParams<D, S, W>
  } & (
    Status extends 'progress' | 'end'
    ? {
      ctx: WorkflowContext<D, S, W>
      progress: Status extends 'end' ? WorkflowEndProgress<D, S, W> : WorkflowProgress<D, S, W>
    } : {}
  )

export type DomainPersistence = {
  getWFState<D extends Domain, S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(_: {
    id: string
  }): Promise<WFState<D, S, W, WFStatus>>

  progressWF<D extends Domain, S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(_: {
    id: string,
    progress: WorkflowEndProgress<D, S, W>
    ctx?: WorkflowContext<D, S, W>,
  }): Promise<WFState<D, S, W, 'progress'>>

  enqueueWF<D extends Domain, S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(_: {
    id: string,
    startParams: WorkflowStartParams<D, S, W>,
    ctx: WorkflowContext<D, S, W>,
  }): Promise<WFState<D, S, W, 'enqueued'>>

  endWF<D extends Domain, S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(_: {
    id: string,
    endProgress: WorkflowEndProgress<D, S, W>,
    ctx?: WorkflowContext<D, S, W>,
  }): Promise<WFState<D, S, W, 'end'>>
}
