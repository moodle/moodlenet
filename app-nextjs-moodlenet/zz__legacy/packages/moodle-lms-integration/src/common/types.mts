export * from './my-webapp/types.mjs'

export interface ImportTarget {
  course: string
  section: string
}

export type LmsSite = {
  url: string
  importTargets: ImportTarget[]
}

export type LmsWebUserConfig = {
  sites: LmsSite[]
}

export type SiteTarget = {
  site: string
  importTarget?: ImportTarget
}
