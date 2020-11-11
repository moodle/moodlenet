export type Payload = any
export type Progress = { _end: boolean }
export type StrName = Exclude<string, TopicWildCard>
export type Domain = {
  name: string
  services: {
    [service in StrName]: {
      wf: {
        [workflow in StrName]: {
          context: Payload
          enqueue: Payload
          progress: {
            [progressName in StrName]: Progress
          }
          signal: {
            [signalType in StrName]: Payload
          }
        }
      }
      ev: {
        [signalType in StrName]: Payload
      }
    }
  }
}

export type WFConsumer<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
> = (params: WorkflowStartParams<D, S, W>, wf: WFMeta) => unknown

export type WFMeta = {
  wfid: string
  // enqueuedAt:Date
  // startedAt:Date
}

export type TopicWildCard = '*' //| '#'
export type WFLifeCycle = Exclude<
  keyof Domain['services'][string]['wf'][string],
  'context' | 'signal'
>
export type DomainName<D extends Domain> = D['name']
export type ServiceNames<D extends Domain> = keyof D['services']

export type WorkflowNames<
  D extends Domain,
  S extends ServiceNames<D>
> = keyof D['services'][S]['wf']

export type Workflow<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
> = D['services'][S]['wf'][W]

export type WorkflowStartParams<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
> = Workflow<D, S, W>['enqueue']

export type WorkflowProgress<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
> = Workflow<D, S, W>['progress']

type TypeUnion<T> = keyof T extends infer P // Introduce an extra type parameter P to distribute over
  ? P extends keyof T
    ? T[P] & { _type: P } // Take each P and create the union member
    : never
  : never

export type WorkflowProgressPayload<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>,
  Type extends keyof WorkflowProgress<D, S, W>
> = Type extends TopicWildCard
  ? TypeUnion<WorkflowProgress<D, S, W>>
  : WorkflowProgress<D, S, W>[Type] & { _type: Type }

export type WorkflowSignalMap<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
> = Workflow<D, S, W>['signal']

export type WorkflowContext<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
> = Workflow<D, S, W>['context']

export type EventPayload<
  D extends Domain,
  S extends ServiceNames<D>,
  E extends TopicWildCard | EventNames<D, S>
> = E extends TopicWildCard
  ? TypeUnion<D['services'][S]['ev']>
  : D['services'][S]['ev'][E] & { _type: E }

export type EventNames<D extends Domain, S extends ServiceNames<D>> = keyof D['services'][S]['ev']

export type Sync<Start, Success, Fail> = {
  start: Start
  end: {
    Success: Success
    Fail: Fail | SyncFail
  }
}
export type SyncFail = null
