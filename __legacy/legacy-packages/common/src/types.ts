import { Timestamp } from './content-graph/types/common'
import { GraphNodeIdentifierAuth, isGraphNodeIdentifierAuth } from './content-graph/types/node'

export type SessionEnv = {
  authId: GraphNodeIdentifierAuth | null
  timestamp: Timestamp
}
export const isSessionEnv = (_: any): _ is SessionEnv =>
  !!_ && 'authId' in _ && (_.authId === null || isGraphNodeIdentifierAuth(_.authId))
