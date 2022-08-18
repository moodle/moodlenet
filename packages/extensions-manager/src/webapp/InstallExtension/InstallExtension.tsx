// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { CoreExt, PackageInfo } from '@moodlenet/core'
import lib from 'moodlenet-react-app-lib'
import { FC, useCallback, useContext, useEffect, useReducer, useState } from 'react'
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

const { Card, PrimaryButton, InputTextField, Loading } = lib.ui.components.atoms

const InstallExtension: FC<InstallExtensionProps> = () => {
  lib.ui.components.organism.Header.useRightComponent({ StdHeaderItems: [DevModeBtn] })

  const { selectedExtInfo, setSelectedExtInfo, devMode, searchPkgResp } = useContext(StateContext)

  const [localPathField, setLocalPathField] = useState('')
  const [isInstalling, toggleIsInstalling] = useReducer((p: boolean) => !p, false)
  const [extInfoList, setExtInfoList] = useState<PackageInfo[]>([])

  useEffect(() => {
    lib.priHttp
      .fetch<CoreExt>('@moodlenet/core@0.1.0')('ext/listDeployed')()
      .then(([{ pkgInfos }]) => setExtInfoList(pkgInfos))
  }, [])
  const install = useCallback(() => {
    if (!localPathField) {
      return
    }
    toggleIsInstalling()
    lib.priHttp.fetch<CoreExt>('@moodlenet/core@0.1.0')('pkg/install')({
      installPkgReq: { type: 'symlink', fromFolder: localPathField },
    })
    // .finally(toggleIsInstalling)
  }, [localPathField])

  return (
    <>
      {!selectedExtInfo && (
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
                    value={localPathField}
                    onChange={(t: any) => setLocalPathField(t.currentTarget.value)}
                    name="package-name"
                    edit
                    // error={shouldShowErrors && editForm.errors.displayName}
                  />
                  <PrimaryButton
                    className={`${isInstalling ? 'loading' : ''}`}
                    disabled={localPathField === ''}
                    noHover={isInstalling}
                    onClick={install}
                  >
                    <div className="loading" style={{ visibility: isInstalling ? 'visible' : 'hidden' }}>
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
              {searchPkgResp?.objects
                .filter(respObj => !extInfoList.find(({ packageJson: { name } }) => respObj.pkgName === name))
                .filter(
                  respObj =>
                    ![
                      '@moodlenet/webapp',
                      '@moodlenet/common',
                      '@moodlenet/backend',
                      '@moodlenet/ce-platform',
                      '@moodlenet/arangodb',
                    ].includes(respObj.pkgName),
                )
                .map(respObj => {
                  // const [pkgBaseName /* , pkgScope */] = splitPkgName(respObj.pkgName)
                  var [extName, description] = respObj.description ? respObj.description.split('\n') : ['', '']
                  extName = extName ? extName : ''
                  description = description ? description : ''
                  return (
                    <div
                      className="package"
                      key={respObj.pkgName}
                      onClick={() =>
                        setSelectedExtInfo(respObj)
                      } /* onClick={() => setSelectedPackage(o.package.name)} */
                    >
                      {/* <PackageIcon /> */}
                      <div className="logo" style={{ background: getPastelColor(getNumberFromString(extName), 0.5) }}>
                        <div className="letter">{extName.substring(0, 1).toLocaleLowerCase()}</div>
                        <div className="circle" style={{ background: getPastelColor(getNumberFromString(extName)) }} />
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
      )}
      {selectedExtInfo && (
        <ExtensionInfo
          isInstalling={isInstalling}
          toggleIsInstalling={toggleIsInstalling}
          searchPackagesResObject={selectedExtInfo}
          onClickBackBtn={() => setSelectedExtInfo(null)}
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
