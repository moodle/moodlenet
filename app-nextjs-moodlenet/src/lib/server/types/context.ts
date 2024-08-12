import { SomeOf } from 'lib/common/utils/types'
import { WebsiteConfig } from './website-config'

export interface ServerContext {
  // pageProps: PagePropsFactories
  session: {
    currentUser: SomeOf<CurrentUser>
    permissions: Partial<Permissions>
    website: WebsiteConfig
  }
}

export interface CurrentUser {
  guest: unknown
  authenticated: {
    displayName: string
    profileUrl: string
    avatarUrl: null | string
  }
}

export interface Permissions {
  createDraftContent: boolean
}
