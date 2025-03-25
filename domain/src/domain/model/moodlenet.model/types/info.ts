import { orgInfo } from '../../org.model'

export type platformInfo = {
  title: string
  subtitle: string
  orgInfo: Pick<orgInfo, 'copyright' | 'physicalAddress' | 'websiteUrl'>
}
