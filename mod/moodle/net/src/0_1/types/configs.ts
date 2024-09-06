import { Deployment, Info } from './configs/info'
import { WebsiteLayouts } from './configs/website/layouts'

export interface Configs {
  info: Info
  websiteLayouts: WebsiteLayouts
  deployment: Deployment
}
