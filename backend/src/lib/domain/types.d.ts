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
  start: [any, any]
  progress: {
    [progressName in string]: any
  }
  end: {
    [endName in string]: any
  }
  signal: {
    [signalType in string]: [any, any]
  }
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
