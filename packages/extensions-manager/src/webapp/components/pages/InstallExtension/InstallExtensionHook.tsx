import { useContext, useEffect, useState } from 'react'
import { SearchPackagesResObject } from '../../../../types.mjs'
import { MainContext } from '../../../MainContext.js'
import { ExtensionType } from '../Extensions/Extensions.js'

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

const pkgName = '@moodlenet/ce-platform'

export const useFilterExtensionList = (
  rawExtensions: SearchPackagesResObject[],
): ExtensionType[] => {
  const { defaultRegistry } = useContext(MainContext)
  const [readme, setReadme] = useState('')
  const [toggleInstallingUninstalling, setToggleInstallingUninstalling] = useState(false)
  useEffect(() => {
    //fetch(`https://registry.npmjs.org/@moodlenet/ce-platform`, {
    fetch(`${defaultRegistry}/${pkgName}`, {
      // mode: 'no-cors',
    })
      .then(_ => _.json())
      .then(({ readme }) => setReadme(readme))
  }, [defaultRegistry])

  const _toggleInstallingUninstalling = () =>
    setToggleInstallingUninstalling(!toggleInstallingUninstalling)

  return rawExtensions
    .filter(rawExtension => approvedExtensions.includes(rawExtension.pkgName))
    .map(rawExtension => {
      return {
        name: rawExtension.pkgName,
        description: rawExtension.description,
        readme: readme,
        installed: rawExtension.installed,
        toggleInstallingUninstalling: _toggleInstallingUninstalling,
        displayName: rawExtension.pkgName,
        isInstallingUninstalling: toggleInstallingUninstalling,
        installUninstallSucces: true,
        repositoryUrl: '',
      }
    })
}
