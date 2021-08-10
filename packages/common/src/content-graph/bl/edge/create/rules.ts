// import { Features } from './Features'
import { CreateEdgeArgs } from './types'

const blMap = {
  // Features,
} as any

export const createEdgeRule = (args: CreateEdgeArgs) => (blMap[args.edgeType] && blMap[args.edgeType](args)) || false
