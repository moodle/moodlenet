import { DomainPersistence } from '../types'
import { delay } from 'bluebird'
const db = {} as any

const saveWFState = (wfid: string, wfstate: any) => {
  db[wfid] = wfstate
  return rndDelay(wfstate)
}
const endWF = (wfid: string, wfstate: any) => saveWFState(wfid, wfstate)
const getLastWFState = (wfid: string) => rndDelay(db[wfid])
export const mockDomainPersistence: DomainPersistence = {
  saveWFState,
  endWF,
  getLastWFState,
}

const min = 10
const range = 500
const rndDelay = (_: any) => delay(Math.random() * range + min, _)
