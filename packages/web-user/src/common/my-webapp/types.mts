import type { ResourceExposeType } from '../expose-def-ed-resource.mjs'
import type { WebUserExposeType } from '../expose-def.mjs'

export type MyWebAppDeps = {
  me: WebUserExposeType
  edResource: ResourceExposeType
}
