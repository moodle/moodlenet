import { DomainPersistence, WFState } from '../types'
import { delay } from 'bluebird'
const db: Record<string, WFState<any, any, any>> = {}

const progressWF: DomainPersistence['progressWF'] = ({ id, progress, ctx }) => {
  const curr = db[id]
  db[id] = {
    ...db[id],
    updated: new Date(),
    ctx: ctx || curr.status === 'progress' ? undefined : curr,
    progress,
    status: 'progress',
  }
  return rndDelay(db[id])
}
const enqueueWF: DomainPersistence['enqueueWF'] = ({ ctx, id, startParams }) => {
  db[id] = {
    status: 'enqueued',
    ctx,
    id,
    startParams,
    started: new Date(),
    updated: new Date(),
  }
  return rndDelay(db[id])
}
const endWF: DomainPersistence['endWF'] = ({ endProgress, id, ctx }) => {
  db[id] = {
    ...db[id],
    status: 'end',
    updated: new Date(),
    ctx: ctx || db[id].ctx,
    progress: endProgress,
  }
  return rndDelay(db[id])
}

const getWFState: DomainPersistence['getWFState'] = ({ id }) => rndDelay(db[id])

export const mockDomainPersistence: DomainPersistence = {
  endWF,
  enqueueWF,
  getWFState,
  progressWF,
}

const min = 10
const range = 500
const rndDelay = (_: any) => delay(Math.random() * range + min, _)
