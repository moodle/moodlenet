import { v1 } from 'uuid'
import { machineId } from './amqp/env'

export type Flow = [route: string, id: string]
export type PFlow = [route?: string, id?: string]

export const newFlow = (pflow?: PFlow): Flow => {
  const [route = machineId, id = v1()] = pflow || []
  return [route, id]
}

export const mergeFlow = (flow: Flow, pflow: PFlow): Flow => [pflow[0] || flow[0], pflow[1] || flow[1]]

export const flowId = (flow: Flow) => flow[1]
export const flowRoute = (flow: Flow) => flow[0]
export const flowIdElse = (pflow: PFlow | null | undefined, _else: string) => (pflow && pflow[1]) || _else
export const flowRouteElse = (pflow: PFlow | null | undefined, _else: string) => (pflow && pflow[0]) || _else
