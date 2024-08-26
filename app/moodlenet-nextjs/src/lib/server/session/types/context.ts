import { Permissions } from './permissions'
import { user } from './user'
import { DeploymentInfo, Modules, WebsiteInfo } from './website'
import { PageLayouts, RootLayouts } from './website/layouts'

type get<T> = <k extends keyof T>(k: k) => Promise<T[k]>
export interface SessionContext {
  currentUser(): Promise<user>
  permission: get<Permissions>
  website: {
    modules: get<Modules>
    info(): Promise<WebsiteInfo>
    deployment(): Promise<DeploymentInfo>
    layouts: {
      pages: get<PageLayouts>
      roots: get<RootLayouts>
    }
  }
}
