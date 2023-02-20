import { DocumentMetadata } from '@moodlenet/arangodb/server'
import { PkgName } from '@moodlenet/core'

export type UserDocument = UserData & DocumentMetadata

export type ProviderId = {
  pkgName: PkgName
  uid: string
}

export type UserData = {
  providerId: ProviderId
  created: string
}
