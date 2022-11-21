import { useContext, useEffect, useMemo, useState } from 'react'
import { ManageExtensionsPropsControlled } from './ManageExtensions.js'

import { ExtensionType } from '../Extensions/Extensions.js'
import { MainContext } from '../../../MainContext.js'
// import packageIcon5 from '../../../assets/icons/package-icon-5.png'
// import packageIcon3 from '../../../assets/icons/package-icon-3.png'

export const useManageExtensionsProps = (
  overrides?: Partial<ManageExtensionsPropsControlled>,
): ManageExtensionsPropsControlled => {
  const [extensions, setExtensions] = useState<ExtensionType[]>([])

  const {
    pkgs: [myPkg],
  } = useContext(MainContext)
  useEffect(() => {
    myPkg
      .call('listDeployed')()
      .then(resp =>
        setExtensions(
          resp.pkgInfos.map<ExtensionType>(({ packageJson, readme = 'N/A' }) => {
            const repositoryUrl =
              typeof packageJson.repository === 'string'
                ? packageJson.repository
                : packageJson.repository?.url ?? 'N/A'
            const developedByMoodleNet = packageJson.name.startsWith('@moodlenet/')
            const extensionType: ExtensionType = {
              description: packageJson.description ?? 'N/A',
              displayName: packageJson.name,
              installed: true,
              repositoryUrl,
              name: packageJson.name,
              readme,
              developedByMoodleNet,
              mandatory: developedByMoodleNet,
              installUninstallSucces: true,
              isInstallingUninstalling: true,
              toggleInstallingUninstalling: () => null,
            }
            return extensionType
          }),
        ),
      )
  }, [myPkg])

  const manageExtensionsPropsControlled = useMemo<ManageExtensionsPropsControlled>(() => {
    const props: ManageExtensionsPropsControlled = {
      extensions,
      ...overrides,
    }
    return props
  }, [extensions, overrides])
  return manageExtensionsPropsControlled
}
