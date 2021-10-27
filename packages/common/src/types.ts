import { GraphNodeType } from './content-graph/types/node'

export type AuthKey = string
export type AuthId = {
  key: AuthKey
  profileType: GraphNodeType
}

export const isAuthId = (_: any): _ is AuthId => !!_ && 'string' === typeof _.id && 'string' === typeof _.profileType

export type SessionEnv = {
  authId: AuthId | null
}
export const isSessionEnv = (_: any): _ is SessionEnv =>
  !!_ && 'authId' in _ && (_.authId === null || isAuthId(_.authId))
