export interface Issuer {
  type: 'user' | 'system' | 'anonymous'
  feats: Record<'publisher' | 'admin' | 'creator', boolean>
}

export const AnonIssuer: Issuer = {
  type: 'anonymous',
  feats: { admin: false, creator: false, publisher: false },
}
export const SystemIssuer: Issuer = {
  type: 'system',
  feats: { admin: false, creator: false, publisher: false },
}
