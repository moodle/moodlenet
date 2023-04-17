import { PkgIdentifier } from '@moodlenet/core'
import { shell } from './shell.mjs'

export type OpenGraphData = {
  title: string
  image: string
  description: string
  // url: string
  // type?: string
}
export type OpenGraphProvider = {
  provider(webappPath: string): Promise<OpenGraphData | undefined>
}
export type OpenGraphProviderItem = OpenGraphProvider & {
  pkgId: PkgIdentifier
}

export const OpenGraphProviderItems: OpenGraphProviderItem[] = []
export function registerOpenGraphProvider(ogProvider: OpenGraphProvider) {
  const { pkgId } = shell.assertCallInitiator()
  OpenGraphProviderItems.push({ ...ogProvider, pkgId })
}
