import { Layouts } from './website/layouts'

export interface Website {
  info: WebsiteInfo
  layouts: Layouts
}

export interface WebsiteInfo {
  domain: string
  secure: boolean
  basePath: string
  title: string
  subtitle: string
  logo: string
  smallLogo: string
}
