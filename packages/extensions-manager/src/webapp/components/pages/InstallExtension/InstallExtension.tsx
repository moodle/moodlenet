// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import {
  AddonItem,
  Card,
  InputTextField,
  Loading,
  PrimaryButton,
  Switch,
} from '@moodlenet/component-library'
import { HeaderRightComponentRegItem } from '@moodlenet/react-app/ui'
import { FC, useContext, useState } from 'react'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
// import { withCtrl } from '../../../../lib/ctrl'
import ExtensionInfo from '../ExtensionInfo/ExtensionInfo.js'
// import { DevModeBtn } from '../Extensions.js'
import { MainContext } from '../../../MainContext.js'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import { getNumberFromString, getPastelColor } from '../../../helpers/utilities.js'
import './InstallExtension.scss'

export type ExtensionType = {
  name: string
  displayName: string
  description: string
  icon?: string
  readme: string
  installed: boolean
  isInstallingUninstalling: boolean
  repositoryUrl: string
  toggleInstallingUninstalling: () => void
}

// export type Extension = {
//   readme: string
// pkgName: string
// description: string
// keywords: string[]
// version?: string
// registry: string
// homepage?: string
// }
//& (
//   | {
//       pkgId: PkgIdentifier<any>
//       installed: true
//     }
//   | {
//       installPkgReq: InstallPkgReq
//       installed: false
//     }
// )

const DevModeBtn: FC = () => {
  const { devMode, setDevMode } = useContext(MainContext)

  return (
    <div className="dev-mode">
      <span className="label">Developer mode</span>
      <Switch enabled={!!devMode} size="medium" onClick={() => setDevMode(p => !p)} />
    </div>
  )
}
const DevModeBtnAddon: HeaderRightComponentRegItem = { Component: DevModeBtn }

export const InstallExtensionMenu: AddonItem = {
  Item: () => <span>Install extensions</span>,
  key: 'menu-install-extensions',
}

export type InstallExtensionProps = {
  // It was empty before
  devMode: boolean
  extensions: ExtensionType[]
  // setDevMode: React.Dispatch<React.SetStateAction<boolean>>
  // selectedExtConfig: DeployedPkgInfo | null
  // setSelectedExtConfig: React.Dispatch<React.SetStateAction<DeployedPkgInfo | null>>
  selectedExt?: ExtensionType
  // setSelectedExt: React.Dispatch<React.SetStateAction<ExtensionType | undefined>>
  // searchPkgResp: SearchPackagesResponse | undefined
  // setSearchPkgResp: React.Dispatch<React.SetStateAction<SearchPackagesResponse | undefined>>
  // menuItemPressed: boolean
}

const InstallExtension: FC<InstallExtensionProps> = ({
  // selectedExt,
  devMode,
  extensions,
  // setSelectedExt,
}) => {
  // const { pkgId, pkgs, selectedExt, setSelectedExt, devMode, searchPkgResp } =
  //   useContext(MainContext)
  // const [myPkg] = pkgs
  // // const { Card, PrimaryButton, InputTextField, Loading } = reactApp.ui.components

  // registries.rightComponents.useRegister(pkgId, DevModeBtnAddon)

  // const [localPathField, setLocalPathField] = useState('')
  const [selectedExt, setSelectedExt] = useState<ExtensionType | undefined>(extensions[1])
  const [isInstalling, toggleIsInstalling] = useState<boolean>(false)
  // const [extInfoList, setExtInfoList] = useState<DeployedPkgInfo[]>([])

  const searchExtensions = !selectedExt && (
    <div className="search-extensions">
      <Card className="install">
        <div className="title">Install extensions</div>
      </Card>
      {devMode && (
        <Card>
          <div className="subtitle">From local package</div>
          <div className="option">
            <div className="name">Local path</div>
            <div className="actions">
              <InputTextField
                className="local-path"
                placeholder="Local path to package"
                // value={localPathField}
                // onChange={(t: any) => setLocalPathField(t.currentTarget.value)}
                name="package-name"
                edit
                // error={shouldShowErrors && editForm.errors.displayName}
              />
              <PrimaryButton
                className={`${isInstalling ? 'loading' : ''}`}
                // disabled={localPathField === ''}
                noHover={isInstalling}
                // onClick={install}
              >
                <div
                  className="loading"
                  style={{ visibility: isInstalling ? 'visible' : 'hidden' }}
                >
                  <Loading color="white" />
                </div>
                <div className="label" style={{ visibility: isInstalling ? 'hidden' : 'visible' }}>
                  Install
                </div>
              </PrimaryButton>
            </div>
          </div>
        </Card>
      )}
      <Card className="available-extensions">
        <div className="subtitle">Compatible extensions</div>
        <div className="list">
          {extensions.map(extension => {
            const { displayName, description, icon } = extension
            const background = icon
              ? { backgroundImage: `url("${extension.icon}")`, backgroundSize: 'cover' }
              : { background: getPastelColor(getNumberFromString(displayName), 0.5) }
            return (
              <div
                className="package"
                key={extension.displayName}
                onClick={() => {
                  setSelectedExt(extension)
                }}
              >
                {/* <PackageIcon /> */}
                <div className="logo" style={background}>
                  {!extension.icon && (
                    <>
                      <div className="letter">
                        {displayName.substring(0, 1).toLocaleLowerCase()}
                      </div>
                      <div
                        className="circle"
                        style={{ background: getPastelColor(getNumberFromString(displayName)) }}
                      />
                    </>
                  )}
                </div>
                <div className="info">
                  <div className="title">{displayName}</div>
                  <div className="details">{description}</div>
                </div>
                <PrimaryButton className="install-btn">Details</PrimaryButton>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )

  return (
    <>
      {searchExtensions}
      {selectedExt && (
        <ExtensionInfo extension={selectedExt} onClickBackBtn={() => setSelectedExt(undefined)} />
      )}
      {/* {isInstalling && (
        <div style={{ position: 'fixed', top: '0', bottom: '0', left: '0', right: '0', background: 'rgba(0,0,0,0.6)' }}>
          <h1 style={{ textAlign: 'center', color: 'white' }}>Spinner !</h1>
        </div>
      )} */}
    </>
  )
}
InstallExtension.displayName = 'InstallExtension'
export default InstallExtension
