// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { Card } from '@moodlenet/component-library'
import type { FC } from 'react'
import { useState } from 'react'
import ExtensionsList from '../../organisms/ExtensionsList/ExtensionsList'
import ExtensionInfo from '../ExtensionInfo/ExtensionInfo'
import type { ExtensionType } from '../Extensions/Extensions'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
import './ManageExtensions.scss'

export const ManageExtensionsMenu = () => <span>Manage extensions</span>

export type ManageExtensionsPropsControlled = Omit<ManageExtensionsProps, 'setShowInstallExtension'>
export type ManageExtensionsProps = {
  extensions: ExtensionType[]
  setShowInstallExtension?: React.Dispatch<React.SetStateAction<boolean>>
  // menuItemPressed: boolean
}
const ManageExtensions: FC<ManageExtensionsProps> = ({ extensions, setShowInstallExtension }) => {
  const [selectedExt, setSelectedExt] = useState<ExtensionType | undefined>()
  const [showManageExtensions /* , setShowManageExtensions */] = useState(true)

  const selectExtension = (ext: ExtensionType) => {
    setSelectedExt(ext)
    setShowInstallExtension && setShowInstallExtension(false)
  }
  const diselectExtension = () => {
    setSelectedExt(undefined)
    setShowInstallExtension && setShowInstallExtension(true)
  }

  const manageExtensions = !selectedExt && (
    <div className="manage-extensions">
      <Card
        className="title"
        // onClick={() => setShowManageExtensions(!showManageExtensions)}
      >
        <div className="title">Extensions</div>
        {/* {showManageExtensions ? <KeyboardArrowUpRounded /> : <KeyboardArrowLeftRounded />} */}
      </Card>
      {showManageExtensions && (
        <ExtensionsList
          extensions={extensions}
          setSelectedExt={selectExtension}
          title="Installed extensions"
        />
      )}
    </div>
  )

  return (
    <>
      {manageExtensions}
      {selectedExt && (
        <ExtensionInfo extension={selectedExt} onClickBackBtn={diselectExtension}>
          {selectedExt.config && <selectedExt.config.Item key={selectedExt.config.key} />}
        </ExtensionInfo>
      )}
    </>
  )
}
ManageExtensions.displayName = 'ManageExtensions'
export default ManageExtensions
