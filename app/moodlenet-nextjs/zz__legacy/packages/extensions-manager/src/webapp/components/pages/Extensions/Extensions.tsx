import type { AddonItem } from '@moodlenet/component-library'
import type { FC } from 'react'
import type { ManageExtensionsPropsControlled } from '../ManageExtensions/ManageExtensions.js'
import ManageExtensions from '../ManageExtensions/ManageExtensions.js'
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

export const ExtensionsMenu: FC = () => <abbr title="Extensions">Extensions</abbr>

export type ExtensionsProps = {
  // installExtensionProps: InstallExtensionPropsControlled
  manageExtensionsProps: ManageExtensionsPropsControlled
}

const Extensions: FC<ExtensionsProps> = ({
  // installExtensionProps,
  manageExtensionsProps,
}) => {
  // const [showInstallExtension, setShowInstallExtension] = useState(true)
  // const [showManageExtensions, setShowManageExtensions] = useState(true)
  return (
    <div className="extensions">
      {/* {showInstallExtension && (
        <InstallExtension
          {...installExtensionProps}
          setShowManageExtensions={setShowManageExtensions}
        />
      )} */}
      {/* {showManageExtensions && ( */}
      <ManageExtensions
        {...manageExtensionsProps}
        // setShowInstallExtension={setShowInstallExtension}
      />
      {/* )} */}
    </div>
  )
}
Extensions.displayName = 'Extensions'
export default Extensions
