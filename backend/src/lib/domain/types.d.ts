export type X = any
export type Domain = {
  name: string
  services: {
    [service: string]: {
      wf: {
        [workflow: string]: {
          context: X
          enqueue: X
          progress: {
            [progressName: string]: X
          }
          end: {
            [endType: string]: X
          }
          signal: {
            [signalType: string]: X
          }
        }
      }
      ev: {
        [signalType: string]: X
      }
    }
  }
}

export type WildKey<T, K extends string> = K extends keyof T ? K : keyof T

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
export type WFAction = Exclude<keyof Domain['services'][string]['wf'][string], 'context'>
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

export type WorkflowActionPayload<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>,
  A extends Exclude<WFAction, 'enqueue'>,
  Type extends keyof Workflow<D, S, W>[A] = keyof Workflow<D, S, W>[A]
> = {
  _type: Type
} & Workflow<D, S, W>[A][Type]

export type WorkflowEndMap<
  D extends Domain,
  S extends ServiceNames<D>,
  W extends WorkflowNames<D, S>
> = Workflow<D, S, W>['end']

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
  E extends EventNames<D, S>
> = D['services'][S]['ev'][E]

export type EventNames<D extends Domain, S extends ServiceNames<D>> = keyof D['services'][S]['ev']

export type Sync<Start, Success, Fail> = {
  start: Start
  end: {
    Success: Success
    Fail: Fail | SyncFail
  }
}
export type SyncFail = null
