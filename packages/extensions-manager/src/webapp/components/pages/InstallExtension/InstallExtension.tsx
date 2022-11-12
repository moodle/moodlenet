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
import { FC, useContext, useReducer } from 'react'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
// import { withCtrl } from '../../../../lib/ctrl'
import ExtensionInfo from '../ExtensionInfo/ExtensionInfo.js'
// import { DevModeBtn } from '../Extensions.js'
import { MainContext } from '../../../MainContext.js'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import { getNumberFromString, getPastelColor } from '../../../helpers/utilities.js'
import './InstallExtension.scss'
import { ExtensionType } from './InstallExtensionCtrl.js'

export type Extension = {
  readme: string
  // pkgName: string
  // description: string
  // keywords: string[]
  // version?: string
  // registry: string
  // homepage?: string
}
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

export type InstallExtensionProps = {
  // It was empty before
  devMode: boolean
  extensions: ExtensionType[]
  // setDevMode: React.Dispatch<React.SetStateAction<boolean>>
  // selectedExtConfig: DeployedPkgInfo | null
  // setSelectedExtConfig: React.Dispatch<React.SetStateAction<DeployedPkgInfo | null>>
  selectedExt?: Extension
  setSelectedExt: React.Dispatch<React.SetStateAction<ExtensionType | null>>
  // searchPkgResp: SearchPackagesResponse | undefined
  // setSearchPkgResp: React.Dispatch<React.SetStateAction<SearchPackagesResponse | undefined>>
  // menuItemPressed: boolean
}

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

export const InstallExtensionsMenu: AddonItem = {
  Item: () => <span>Install extensions</span>,
  key: 'menu-install-extensions',
}

const InstallExtension: FC<InstallExtensionProps> = ({
  selectedExt,
  devMode,
  extensions,
  setSelectedExt,
}) => {
  // const { pkgId, pkgs, selectedExt, setSelectedExt, devMode, searchPkgResp } =
  //   useContext(MainContext)
  // const [myPkg] = pkgs
  // // const { Card, PrimaryButton, InputTextField, Loading } = reactApp.ui.components

  // registries.rightComponents.useRegister(pkgId, DevModeBtnAddon)

  // const [localPathField, setLocalPathField] = useState('')
  const [isInstalling, toggleIsInstalling] = useReducer((p: boolean) => !p, false)
  // const [extInfoList, setExtInfoList] = useState<DeployedPkgInfo[]>([])

  // useEffect(() => {
  //   myPkg
  //     .call('listDeployed')()
  //     .then(({ pkgInfos }) => setExtInfoList(pkgInfos))
  // }, [myPkg])
  // const install = useCallback(() => {
  //   if (!localPathField) {
  //     return
  //   }
  //   toggleIsInstalling()
  //   myPkg.call('install')({
  //     installPkgReq: { type: 'symlink', fromFolder: localPathField },
  //   })
  //   // .finally(toggleIsInstalling)
  // }, [localPathField, myPkg])

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
            let [extName, description] = extension.description
              ? extension.description.split('\n')
              : ['', '']
            extName = extName ? extName : ''
            description = description ? description : ''
            return (
              <div
                className="package"
                key={extension.name}
                onClick={() =>
                  setSelectedExt(extension)
                } /* onClick={() => setSelectedPackage(o.package.name)} */
              >
                {/* <PackageIcon /> */}
                <div
                  className="logo"
                  style={{ background: getPastelColor(getNumberFromString(extName), 0.5) }}
                >
                  <div className="letter">{extName.substring(0, 1).toLocaleLowerCase()}</div>
                  <div
                    className="circle"
                    style={{ background: getPastelColor(getNumberFromString(extName)) }}
                  />
                </div>
                <div className="info">
                  <div className="title">{extName}</div>
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
        <ExtensionInfo
          readme={selectedExt.readme}
          // isInstalling={isInstalling}
          // toggleIsInstalling={toggleIsInstalling}
          // searchPackagesResObject={selectedExt}
          // onClickBackBtn={() => setSelectedExt(null)}
        />
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
