// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { AddonItem, Card } from '@moodlenet/component-library'
import { FC, useState } from 'react'
import ExtensionsList from '../../organisms/ExtensionsList/ExtensionsList.js'
import ExtensionInfo from '../ExtensionInfo/ExtensionInfo.js'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import { ExtensionType } from '../InstallExtension/InstallExtension.js'
import './ManageExtensions.scss'

export const ManageExtensionsMenu: AddonItem = {
  Item: () => <span>Manage extensions</span>,
  key: 'menu-manage-extensions',
}

export type ManageExtensionsProps = {
  extensions: ExtensionType[]
  // menuItemPressed: boolean
}

const ManageExtensions: FC<ManageExtensionsProps> = ({ extensions }) => {
  const [selectedExt, setSelectedExt] = useState<ExtensionType | undefined>()

  const manageExtensions = !selectedExt && (
    <div className="manage-extensions">
      <Card className="title">
        <div className="title">Manage extensions</div>
      </Card>
      <ExtensionsList
        extensions={extensions}
        setSelectedExt={setSelectedExt}
        title="Installed extensions"
      />
    </div>
  )

  return (
    <>
      {manageExtensions}
      {selectedExt && (
        <ExtensionInfo extension={selectedExt} onClickBackBtn={() => setSelectedExt(undefined)}>
          {selectedExt.config && <selectedExt.config.Item key={selectedExt.config.key} />}
        </ExtensionInfo>
      )}
    </>
  )
}
ManageExtensions.displayName = 'ManageExtensions'
export default ManageExtensions
