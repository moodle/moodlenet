import { SendEmailResult, SendEmailResultOK } from './types'
import { v4 as uuidv4 } from 'uuid'

export const uuid: () => string = uuidv4
export const isResultOk = (_: SendEmailResult): _ is SendEmailResultOK => 'id' in _
