import { SomeOf } from 'lib/common/utils/types'
import { WebappConfig } from './webapp-config'

// export interface PageProps {
//   v: '1.0'
// }
// export type PagePropsFactories = {
//   [k in keyof PageProps]: (() => PageProps[k] | Promise<PageProps[k]>) | PageProps[k]
// }
export interface ServerContext {
  // pageProps: PagePropsFactories
  session: {
    currentUser: SomeOf<CurrentUser>
    permissions: Partial<Permissions>
    webapp: WebappConfig
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
