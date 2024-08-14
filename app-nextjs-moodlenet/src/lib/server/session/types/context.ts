import { Permissions } from './permissions'
import { user } from './user'
import { Modules, WebsiteInfo } from './website'
import { PageLayouts, RootLayouts } from './website/layouts'

type getter<T> = <k extends keyof T>(k: k) => Promise<T[k]>
export interface SessionContext {
  currentUser(): Promise<user>
  permission: getter<Permissions>
  website: {
    modules: getter<Modules>
    info(): Promise<WebsiteInfo>
    layouts: {
      pages: getter<PageLayouts>
      roots: getter<RootLayouts>
    }
  }
}
