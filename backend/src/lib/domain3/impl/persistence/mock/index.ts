import { DomainPersistence, WFState } from '../../../types'
import { delay } from 'bluebird'
const db: Record<string, WFState<any, any, any>> = {}

const ldb = (s: string) => console.log(s, ':', db)

const progressWF: DomainPersistence['progressWF'] = ({ id, progress /* ctx */ }) => {
  db[id] = {
    ...db[id],
    // ctx,
    updated: new Date(),
    progress,
    status: 'progress',
  }
  ldb(`progressWF ${id}`)
  return rndDelay(null)
}
const enqueueWF: DomainPersistence['enqueueWF'] = (enqueueState) => {
  db[enqueueState.id] = {
    ...enqueueState,
    status: 'enqueued',
    started: new Date(),
    updated: new Date(),
  }
  ldb(`enqueueWF ${enqueueState.id}`)
  return rndDelay(null)
}
const endWF: DomainPersistence['endWF'] = ({ endProgress, id /* ctx */ }) => {
  db[id] = {
    ...db[id],
    // ctx,
    status: 'end',
    updated: new Date(),
    progress: endProgress,
  }
  ldb(`endWF ${id}`)
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
