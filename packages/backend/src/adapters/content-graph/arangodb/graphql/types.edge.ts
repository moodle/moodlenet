import { Document } from 'arangojs/documents'
import { ShallowEdge } from '../../../../graphql/types.node'

export const EdgeResolver = {
  id: (parent: Document<ShallowEdge>) => parent._id,
} as any
