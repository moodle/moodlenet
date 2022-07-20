// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { CoreExt } from '@moodlenet/core'
import lib from 'moodlenet-react-app-lib'
import { FC, useCallback, useContext, useEffect, useReducer, useState } from 'react'
import { ExtensionsManagerExt } from '../..'
import { SearchPackagesResponse } from '../../types/data'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
// import { withCtrl } from '../../../../lib/ctrl'
import ExtensionInfo from '../ExtensionInfo/ExtensionInfo'
import { DevModeBtn } from '../Extensions'
import { StateContext } from '../ExtensionsProvider'
import { getNumberFromString, getPastelColor, splitPkgName } from '../helpers/utilities'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import './InstallExtension.scss'

export type InstallExtensionProps = {
  // menuItemPressed: boolean
}

const { Card, PrimaryButton, InputTextField } = lib.ui.components.atoms

const InstallExtension: FC<InstallExtensionProps> = () => {
  lib.ui.components.organism.Header.useRightComponent({ StdHeaderItems: [DevModeBtn] })

  const { selectedExtInfo, setSelectedExtInfo } = useContext(StateContext)
  const [searchPkgResp, setSearchPkgResp] = useState<SearchPackagesResponse>()
  const { devMode } = useContext(StateContext)

  useEffect(() => {
    lib.priHttp
      .fetch<ExtensionsManagerExt>(
        'moodlenet-extensions-manager',
        '0.1.10',
      )('searchPackages')({ searchText: 'moodlenet' })
      .then(resp => setSearchPkgResp(resp))
  }, [])
  const [localPathField, setLocalPathField] = useState('')
  const [isInstalling, toggleIsInstalling] = useReducer((p: boolean) => !p, false)
  const install = useCallback(() => {
    if (!localPathField) {
      return
    }
    toggleIsInstalling()
    lib.priHttp
      .fetch<CoreExt>(
        'moodlenet-core',
        '0.1.10',
      )('pkg/install')({
        installPkgReq: { type: 'symlink', fromFolder: localPathField },
        deploy: true,
      })
      .finally(toggleIsInstalling)
  }, [localPathField])
  return (
    <>
      {!selectedExtInfo && (
        <div className="search-extensions">
          <Card className="install">
            <div className="title">Add extensions</div>
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
                    value={localPathField}
                    onChange={(t: any) => setLocalPathField(t.currentTarget.value)}
                    name="package-name"
                    edit
                    // error={shouldShowErrors && editForm.errors.displayName}
                  />
                  <PrimaryButton disabled={localPathField === ''} onClick={install}>
                    Install
                  </PrimaryButton>
                </div>
              </div>
            </Card>
          )}
          <Card className="available-extensions">
            <div className="subtitle">Compatible extensions</div>
            <div className="list">
              {searchPkgResp?.objects.map(respObj => {
                const [pkgBaseName /* , pkgScope */] = splitPkgName(respObj.pkgName)
                return (
                  <div
                    className="package"
                    key={respObj.pkgName}
                    onClick={() => setSelectedExtInfo(respObj)} /* onClick={() => setSelectedPackage(o.package.name)} */
                  >
                    {/* <PackageIcon /> */}
                    <div className="logo" style={{ background: getPastelColor(getNumberFromString(pkgBaseName), 0.5) }}>
                      <div className="letter">{pkgBaseName.substring(0, 1).toLocaleLowerCase()}</div>
                      <div
                        className="circle"
                        style={{ background: getPastelColor(getNumberFromString(pkgBaseName)) }}
                      />
                    </div>
                    <div className="info">
                      <div className="title">{respObj.description}</div>
                      <div className="details">{respObj.pkgName}</div>
                    </div>
                    <PrimaryButton className="install-btn">Details</PrimaryButton>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}
      {selectedExtInfo && (
        <ExtensionInfo
          toggleIsInstalling={toggleIsInstalling}
          searchPackagesResObject={selectedExtInfo}
          onClickBackBtn={() => setSelectedExtInfo(null)}
        />
      )}
      {isInstalling && (
        <div style={{ position: 'fixed', top: '0', bottom: '0', left: '0', right: '0', background: 'rgba(0,0,0,0.6)' }}>
          <h1 style={{ textAlign: 'center', color: 'white' }}>Spinner !</h1>
        </div>
      )}
    </>
  )
}
InstallExtension.displayName = 'InstallExtension'
export default InstallExtension
