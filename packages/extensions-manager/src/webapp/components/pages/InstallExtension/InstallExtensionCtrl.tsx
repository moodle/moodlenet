import { useEffect, useState } from 'react'
import { SearchPackagesResObject } from '../../../../types.mjs'
import { ExtensionType } from './InstallExtension.js'

// export type ExtensionType = {
//   name: string
//   description: string
//   readme: string
// }

const approvedExtensions = [
  '@moodlenet/webapp',
  '@moodlenet/common',
  '@moodlenet/backend',
  '@moodlenet/ce-platform',
  '@moodlenet/arangodb',
]

export const useFilterExtensionList = (
  rawExtensions: SearchPackagesResObject[],
): ExtensionType[] => {
  const [readme, setReadme] = useState('')
  useEffect(() => {
    fetch(`https://registry.npmjs.org/@moodlenet/ce-platform`, {
      // mode: 'no-cors',
    })
      .then(_ => _.json())
      .then(({ readme }) => setReadme(readme))
  }, [])
  return rawExtensions
    .filter(rawExtension => approvedExtensions.includes(rawExtension.pkgName))
    .map(rawExtension => {
      return {
        name: rawExtension.pkgName,
        description: rawExtension.description,
        readme: readme,
        installed: rawExtension.installed,
      }
    })
}
