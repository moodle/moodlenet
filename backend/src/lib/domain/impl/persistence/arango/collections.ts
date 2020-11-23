import { Forward } from '../types'
import { db } from './domain.arango.env'

export const Forwards = db.collection<Forward>('Forwards')
