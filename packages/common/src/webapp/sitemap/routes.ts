import { NodeType, Scalars } from '../../pub-graphql/types.graphql.gen'
import { RouteDef } from './types'

export type ActivateNewAccount = RouteDef<'/activate-new-account/:token', { token: string }>
export type Login = RouteDef<'/login', {}>
export type ContentNode = RouteDef<
  `/content/:nodeType/:id`,
  {
    id: Scalars['ID']
    nodeType: NodeType
  }
>
