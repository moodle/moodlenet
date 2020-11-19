import { WFLifePayload, WFState, WFStateEnqueueParams } from '../../../types'
import { db } from './domain.arango.env'

// const Config = db.collection('Config')

type LogRecord = { at: Date } & (
  | WFStateEnqueueParams<any, any, any>
  | WFLifePayload<any, any, any, 'end' | 'progress' | 'signal'>
)
export const WFLog = db.collection<LogRecord>('WFLog')
export const WFActive = db.collection<WFState<any, any, any>>('WFActive')
