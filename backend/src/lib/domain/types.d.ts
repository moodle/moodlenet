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
  wfid: string
  // enqueuedAt:Date
  // startedAt:Date
}

export type TopicWildCard = '*' //| '#'
export type WFLifeCycle = 'progress' | 'end'
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

export type WorkflowProgress<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
> = Workflow<D, S, W>['progress']

export type WorkflowEnd<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
> = Workflow<D, S, W>['end']

type TypeUnion<T> = keyof T extends infer P // Introduce an extra type parameter P to distribute over
  ? P extends keyof T
    ? T[P] & { _type: P } // Take each P and create the union member
    : never
  : never

export type WorkflowEndFn<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
> = (end: WorkflowEndPayload<D, S, W>, ctx?: WorkflowContext<D, S, W>) => unknown

export type WorkflowProgressPayload<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
> = TypeUnion<WorkflowProgress<D, S, W>>

export type WorkflowEndPayload<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
> = TypeUnion<WorkflowEnd<D, S, W>>

export type WorkflowPayload<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
> = WorkflowEndPayload<D, S, W> | WorkflowProgressPayload<D, S, W>

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

export type WFState<D extends Domain, S extends ServiceNames<D>, W extends WorkflowNames<D, S>> = {
  ctx: WorkflowContext<D, S, W>
  state: WorkflowPayload<D, S, W>
  //TODO : add isFinished:boolean
  //TODO : add parentWF:`srv.wf.id`
}

export type DomainPersistence = {
  getLastWFState<D extends Domain, S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(
    wfid: string
  ): Promise<WFState<D, S, W>>

  saveWFState<D extends Domain, S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(
    wfid: string,
    wfstate: WFState<D, S, W>
  ): Promise<WFState<D, S, W>>

  endWF<D extends Domain, S extends ServiceNames<D>, W extends WorkflowNames<D, S>>(
    wfid: string,
    wfstate: WFState<D, S, W>
  ): Promise<WFState<D, S, W>>
}
