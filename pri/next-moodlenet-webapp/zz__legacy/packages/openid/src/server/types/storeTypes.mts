import type { AdapterPayload } from 'oidc-provider'

export type OtherModelsName = string

export type StoreItem = {
  expiresIn: number
  insertedAt: string
  payload: AdapterPayload
}
export type OpenIdKeyValueData = {
  grant: [model: string, id: string][]
  sessionUid: string
  userCode: string
} & {
  [k: OtherModelsName]: StoreItem
}
