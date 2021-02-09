import { NodeType, Scalars } from '../graphql/types.graphql.gen'
import { RouteDef } from './lib'

export type ActivateNewAccountRouteDef = RouteDef<'/activate-new-account/:token', { token: string }>

export type LoginRouteDef = RouteDef<'/login', {}>

export type ContentNodeRouteDef = RouteDef<
  `/content/:nodeType/:id`,
  {
    id: Scalars['ID']
    nodeType: NodeType
  }
>
