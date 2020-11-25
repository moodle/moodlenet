export type DomainTopic = { domain: string; topic: string }
export type DomainTopicTarget = DomainTopic
export type Forward = { src: DomainTopic; trg: DomainTopicTarget[] }
//TODO: target may be a queue if we define a type DomainQueue<S extends string, T> = S&{$type?:T}
// type DomainQueue<T, S extends string=string> = S&{$type?:T}
// const mkq = <T,S extends string=string>(s:S):DomainQueue<T,S>=>s as DomainQueue<T,S>
// const q1 = mkq<{a:1}>('ciccio')
// const fn1 = (_:DomainQueue<{a:1}>)=>{}
// fn1(q1) // ok
// const fn2 = (_:DomainQueue<{a:2}>)=>{}
// fn2(q1) // err

/**
 * Persistence
 */

export interface DomainPersistence {
  addForward(_: { key: string; src: DomainTopic; trg: DomainTopicTarget }): Promise<unknown>
  removeForward(_: { key: string; src: DomainTopic; trg: DomainTopicTarget }): Promise<unknown>
  getForwards(_: { key: string; src: DomainTopic }): Promise<Forward['trg']>
}
