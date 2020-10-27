// import { Job, JobsOptions, Queue, QueueOptions, Worker } from 'bullmq'

// export type MNQueue<In = any, Out = any> = Queue<In>

// export const MNQueue = <Name extends string, In, Out>(
//   name: Name,
//   opts?: QueueOptions
// ): MNQueue<In, Out> => {
//   return new Queue<In>(name, opts)
// }

// export const addToQueue = <Q extends MNQueue>(
//   q: Q,
//   name: string,
//   data: Q extends MNQueue<infer In, any> ? In : never,
//   opts?: JobsOptions
// ) => {
//   return q.add(name, data, opts)
// }

// export const consumeQueue = <Q extends MNQueue>(
//   q: Q,
//   handler: Q extends MNQueue<infer In, infer Out> ? (_: Job<In, Out>) => Promise<Out> : never
// ) => {
//   return new Worker(q.name, handler)
// }

export const UNNAMED_JOB = 'UNNAMED_JOB'
