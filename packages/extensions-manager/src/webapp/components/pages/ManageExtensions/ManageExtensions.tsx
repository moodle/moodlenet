// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { AddonItem, Card } from '@moodlenet/component-library'
import { KeyboardArrowLeftRounded, KeyboardArrowUpRounded } from '@mui/icons-material'
import { FC, useState } from 'react'
import ExtensionsList from '../../organisms/ExtensionsList/ExtensionsList.js'
import ExtensionInfo from '../ExtensionInfo/ExtensionInfo.js'
import { ExtensionType } from '../Extensions/Extensions.js'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
import './ManageExtensions.scss'

export const ManageExtensionsMenu: AddonItem = {
  Item: () => <span>Manage extensions</span>,
  key: 'menu-manage-extensions',
}

export type ManageExtensionsProps = {
  extensions: ExtensionType[]
  setShowInstallExtension?: React.Dispatch<React.SetStateAction<boolean>>
  // menuItemPressed: boolean
}

const ManageExtensions: FC<ManageExtensionsProps> = ({ extensions, setShowInstallExtension }) => {
  const [selectedExt, setSelectedExt] = useState<ExtensionType | undefined>()
  const [showManageExtensions, setShowManageExtensions] = useState(true)

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
      <Card className="title" onClick={() => setShowManageExtensions(!showManageExtensions)}>
        <div className="title">Manage extensions</div>
        {showManageExtensions ? <KeyboardArrowUpRounded /> : <KeyboardArrowLeftRounded />}
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
