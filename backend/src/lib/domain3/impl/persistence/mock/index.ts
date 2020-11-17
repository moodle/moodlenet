import { DomainPersistence, WFState } from '../../../types'
import { delay } from 'bluebird'
const db: Record<string, WFState<any, any, any>> = {}

const progressWF: DomainPersistence['progressWF'] = ({ id, progress, ctx }) => {
  db[id] = {
    ...db[id],
    ctx,
    updated: new Date(),
    progress,
    status: 'progress',
  }
  return rndDelay(null)
}
const enqueueWF: DomainPersistence['enqueueWF'] = (enqueueState) => {
  db[enqueueState.id] = {
    ...enqueueState,
    status: 'enqueued',
    started: new Date(),
    updated: new Date(),
  }
  return rndDelay(null)
}
const endWF: DomainPersistence['endWF'] = ({ endProgress, id, ctx }) => {
  db[id] = {
    ...db[id],
    ctx,
    status: 'end',
    updated: new Date(),
    progress: endProgress,
  }
  return rndDelay(null)
}

const getWFState: DomainPersistence['getWFState'] = ({ id }) => rndDelay(db[id])

const mockDomainPersistence: DomainPersistence = {
  endWF,
  enqueueWF,
  getWFState,
  progressWF,
}
module.exports = mockDomainPersistence
const min = 1
const max = 5
const rndDelay = (_: any) => delay(Math.random() * (max - min) + min, _)
