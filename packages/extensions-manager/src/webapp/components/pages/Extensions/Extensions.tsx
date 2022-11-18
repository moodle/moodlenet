import { AddonItem } from '@moodlenet/component-library'
import { FC, useState } from 'react'
import InstallExtension, { InstallExtensionProps } from '../InstallExtension/InstallExtension.js'
import ManageExtensions, { ManageExtensionsProps } from '../ManageExtensions/ManageExtensions.js'
import './Extensions.scss'

export type ExtensionType = {
  name: string
  displayName: string
  description: string
  icon?: string
  readme: string
  mandatory?: boolean
  developedByMoodleNet?: boolean
  installed: boolean
  repositoryUrl: string
  isInstallingUninstalling: boolean
  installUninstallSucces: boolean
  config?: AddonItem
  toggleInstallingUninstalling: () => void
}

export type ExtensionsFormValues = {
  localPath: string
}

export const ExtensionsMenu: AddonItem = {
  Item: () => <span>Extensions</span>,
  key: 'menu-extensions',
}

export type ExtensionsProps = {
  installExtensionProps: InstallExtensionProps
  manageExtensionsProps: ManageExtensionsProps
}

const Extensions: FC<ExtensionsProps> = ({ installExtensionProps, manageExtensionsProps }) => {
  const [showInstallExtension, setShowInstallExtension] = useState(true)
  const [showManageExtensions, setShowManageExtensions] = useState(true)
  return (
    <div className="extensions">
      {showInstallExtension && (
        <InstallExtension
          {...installExtensionProps}
          setShowManageExtensions={setShowManageExtensions}
        />
      )}
      {showManageExtensions && (
        <ManageExtensions
          {...manageExtensionsProps}
          setShowInstallExtension={setShowInstallExtension}
        />
      )}
    </div>
  )
}
Extensions.displayName = 'Extensions'
export default Extensions
