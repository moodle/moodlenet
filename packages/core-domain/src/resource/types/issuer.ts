export type Issuer = SystemIssuer | UnauthenticatedIssuer | UserIssuer

export const UNAUTHENTICATED_ISSUER: UnauthenticatedIssuer = { type: 'unauthenticated' }
export const SYSTEM_ISSUER: SystemIssuer = { type: 'system' }
export interface UnauthenticatedIssuer extends BaseIssuer {
  type: 'unauthenticated'
}
export interface SystemIssuer extends BaseIssuer {
  type: 'system'
}
export interface UserIssuer extends BaseIssuer {
  type: 'user'
  feats: IssuerFeats
}

export type IssuerType = 'user' | 'system' | 'unauthenticated'

export interface IssuerFeats {
  publisher: boolean
  admin: boolean
  creator: boolean
}

interface BaseIssuer {
  type: IssuerType
}
