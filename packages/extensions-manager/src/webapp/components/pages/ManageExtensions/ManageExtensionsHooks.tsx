import { useEffect, useMemo, useReducer, useState } from 'react'
import type { ManageExtensionsPropsControlled } from './ManageExtensions.js'

import { shell } from '../../../shell.mjs'
import type { ExtensionType } from '../Extensions/Extensions.js'
// import packageIcon5 from '../../../assets/icons/package-icon-5.png'
// import packageIcon3 from '../../../assets/icons/package-icon-3.png'

export const useManageExtensionsProps = (
  overrides?: Partial<ManageExtensionsPropsControlled>,
): ManageExtensionsPropsControlled => {
  const [extensions, setExtensions] = useState<ExtensionType[]>([])
  const [installUninstallSucces /* , toggleInstallUninstallSucces */] = useReducer(_ => !_, false)
  const [isInstallingUninstalling /* , toggleIsInstallingUninstalling */] = useReducer(
    _ => !_,
    false,
  )

  useEffect(() => {
    shell.rpc
      .me('listDeployed')()
      .then(resp =>
        setExtensions(
          resp.pkgInfos.map<ExtensionType>(({ packageJson, readme = 'N/A' /* , pkgId */ }) => {
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
              installUninstallSucces,
              isInstallingUninstalling,
              toggleInstallingUninstalling: () => {
                // if (isInstallingUninstalling) {
                //   return
                // }
                // toggleIsInstallingUninstalling()
                // shell.rpc.me.uninstall([pkgId]).then(() => {
                //   toggleInstallUninstallSucces()
                //   toggleIsInstallingUninstalling()
                // })
              },
            }
            return extensionType
          }),
        ),
      )
  }, [installUninstallSucces, isInstallingUninstalling])

  const manageExtensionsPropsControlled = useMemo<ManageExtensionsPropsControlled>(() => {
    const props: ManageExtensionsPropsControlled = {
      extensions,
      ...overrides,
    }
    return props
  }, [extensions, overrides])
  return manageExtensionsPropsControlled
}
