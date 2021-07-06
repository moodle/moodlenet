import { Contains } from './Contains'
import { CreateEdgeArgs } from './types'

const blMap = {
  Contains,
} as any

export const createEdgeRule = (args: CreateEdgeArgs) =>
  (args.userRole !== 'Guest' && blMap[args.edgeType] && blMap[args.edgeType](args)) || true
