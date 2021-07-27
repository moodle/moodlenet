// import { Contains } from './Contains'
import { CreateEdgeArgs } from './types'

const blMap = {
  // Contains,
} as any

export const createEdgeRule = (args: CreateEdgeArgs) => (blMap[args.edgeType] && blMap[args.edgeType](args)) || false
