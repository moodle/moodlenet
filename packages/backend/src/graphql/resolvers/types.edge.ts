import { Document } from 'arangojs/documents'
import { ShallowEdge } from '../types.node'

export const EdgeResolver = {
  id: (parent: Document<ShallowEdge>) => parent._id,
} as any
