import { v1 } from 'uuid'
import { Flow, PFlow } from './types/path'

export const nodeId = v1().split('-').slice(-1).pop()!

export const newFlow = (pflow?: PFlow): Flow => {
  const [route = nodeId, id = v1()] = pflow || []
  return [route, id]
}

export const flowId = (flow: Flow) => flow[1]
export const flowRoute = (flow: Flow) => flow[0]
export const flowIdElse = (pflow: PFlow | null | undefined, _else: string) => (pflow && pflow[1]) || _else
export const flowRouteElse = (pflow: PFlow | null | undefined, _else: string) => (pflow && pflow[0]) || _else
