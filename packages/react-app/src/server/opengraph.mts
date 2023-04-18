import { PkgIdentifier } from '@moodlenet/core'
import { getOrgData } from '@moodlenet/organization/server'
import { shell } from './shell.mjs'

export type RequiredOpenGraphDataProvided = {
  title: string
  description: string
}
export type OptionalOpenGraphDataProvided = {
  url: string
  image: string
  type: string
}

export type OpenGraphDataProvided = RequiredOpenGraphDataProvided &
  Partial<OptionalOpenGraphDataProvided> //&CustomMeta
// export type CustomMeta = {customMeta?:Record<string,string>}
export type OpenGraphData = RequiredOpenGraphDataProvided & OptionalOpenGraphDataProvided //& CustomMeta

export type OpenGraphProvider = {
  provider(webappPath: string): Promise<OpenGraphDataProvided | undefined>
}

export type OpenGraphProviderItem = OpenGraphProvider & {
  pkgId: PkgIdentifier
}

export const OpenGraphProviderItems: OpenGraphProviderItem[] = []

export function registerOpenGraphProvider(ogProvider: OpenGraphProvider) {
  const { pkgId } = shell.assertCallInitiator()
  OpenGraphProviderItems.push({ ...ogProvider, pkgId })
}

export async function getDefaultOpenGraphData(): Promise<OpenGraphDataProvided> {
  const {
    data: { instanceName, landingTitle, landingSubtitle },
  } = await getOrgData()
  return {
    title: `${instanceName}: ${landingTitle}`,
    description: landingSubtitle,
  }
}
