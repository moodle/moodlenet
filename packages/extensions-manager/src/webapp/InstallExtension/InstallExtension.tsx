// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { CoreExt } from '@moodlenet/core'
import lib from 'moodlenet-react-app-lib'
import { FC, useCallback, useContext, useEffect, useState } from 'react'
import { ExtensionsManagerExt } from '../..'
import { SearchPackagesResObject, SearchPackagesResponse } from '../../types/data'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
// import { withCtrl } from '../../../../lib/ctrl'
import ExtensionInfo from '../ExtensionInfo/ExtensionInfo'
import { DevModeBtn } from '../Extensions'
import { StateContext } from '../ExtensionsProvider'
import { getNumberFromString, getPastelColor } from '../helpers/utilities'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import './InstallExtension.scss'

export type InstallExtensionProps = {
  // menuItemPressed: boolean
}

const { Card, PrimaryButton, InputTextField } = lib.ui.components.atoms

const InstallExtension: FC<InstallExtensionProps> = () => {
  lib.ui.components.organism.Header.useRightComponent({ StdHeaderItems: [DevModeBtn] })

  const [selectedPackage, setSelectedPackage] = useState<SearchPackagesResObject>()
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
  const install = useCallback(() => {
    if (!localPathField) {
      return
    }
    lib.priHttp.fetch<CoreExt>('moodlenet-core', '0.1.10')('pkg/install')({
      installPkgReq: { type: 'symlink', fromFolder: localPathField },
      deploy: true,
    })
  }, [localPathField])
  return (
    <>
      {!selectedPackage && (
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
                const name = respObj.name.split('/').reverse()[0]
                return (
                  <div
                    className="package"
                    key={respObj.name}
                    onClick={() => setSelectedPackage(respObj)} /* onClick={() => setSelectedPackage(o.package.name)} */
                  >
                    {/* <PackageIcon /> */}
                    <div
                      className="logo"
                      style={{ background: getPastelColor(getNumberFromString(respObj.name), 0.5) }}
                    >
                      <div className="letter">
                        {respObj.name.split('/').reverse().join('').substring(0, 1).toLocaleLowerCase()}
                      </div>
                      <div
                        className="circle"
                        style={{ background: getPastelColor(getNumberFromString(respObj.name)) }}
                      />
                    </div>
                    <div className="info">
                      <div className="title">
                        {name} {/* v{respObj.version} */}
                      </div>
                      <div className="details">{respObj.description}</div>
                    </div>
                    <PrimaryButton className="install-btn">Details</PrimaryButton>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}
      {selectedPackage && (
        <ExtensionInfo searchPackagesResObject={selectedPackage} onClickBackBtn={() => setSelectedPackage(undefined)} />
      )}
    </>
  )
}
InstallExtension.displayName = 'InstallExtension'
export default InstallExtension
