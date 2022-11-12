import { SearchPackagesResObject } from '../../../../types.mjs'

export type ExtensionType = {
  name: string
  description: string
}

const approvedExtensions = [
  '@moodlenet/webapp',
  '@moodlenet/common',
  '@moodlenet/backend',
  '@moodlenet/ce-platform',
  '@moodlenet/arangodb',
]

export const filterExtensionList = (rawExtensions: SearchPackagesResObject[]): ExtensionType[] => {
  return rawExtensions
    .filter(rawExtension => approvedExtensions.includes(rawExtension.pkgName))
    .map(rawExtension => {
      return {
        name: rawExtension.pkgName,
        description: rawExtension.description,
      }
    })
}
