// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { CoreExt, PackageInfo } from '@moodlenet/core'
import lib from 'moodlenet-react-app-lib'
import { FC, useEffect, useState } from 'react'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
// import { withCtrl } from '../../../../lib/ctrl'
import ExtensionInfo from '../ExtensionInfo/ExtensionInfo'
import { getNumberFromString, getPastelColor } from '../helpers/utilities'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import './styles.scss'

export type InstallExtensionProps = {
  // menuItemPressed: boolean
}

const Card = lib.ui.components.atoms.Card
const InputTextField = lib.ui.components.atoms.InputTextField
const PrimaryButton = lib.ui.components.atoms.PrimaryButton

const InstallExtension: FC<InstallExtensionProps> = () => {
  const [localPathField, setLocalPathField] = useState('')
  const [selectedPackage, setSelectedPackage] = useState<PackageInfo>()
  const [packageInfos, setPackageInfos] = useState<PackageInfo[]>([])

  useEffect(() => {
    lib.priHttp
      .fetch<CoreExt>(
        'moodlenet-core',
        '0.1.10',
      )('pkg/getPkgStorageInfos')()
      .then(({ pkgInfos }) => setPackageInfos(pkgInfos))
  }, [])

  return (
    <>
      {!selectedPackage && (
        <div className="search-extensions">
          <Card className="install">
            <div className="title">Add extension...</div>

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
                <PrimaryButton disabled={localPathField === ''}>Install</PrimaryButton>
              </div>
            </div>
          </Card>
          <Card className="available-extensions">
            <div className="title">Compatible extensions</div>
            <div className="list">
              {packageInfos.map(pkgInfo => {
                return (
                  <div
                    className="package"
                    key={pkgInfo.installationFolder}
                    onClick={() => setSelectedPackage(pkgInfo)} /* onClick={() => setSelectedPackage(o.package.name)} */
                  >
                    {/* <PackageIcon /> */}
                    <div className="left" onClick={() => setSelectedPackage(pkgInfo)}>
                      <div
                        className="logo"
                        style={{ background: getPastelColor(getNumberFromString(pkgInfo.packageJson.name), 0.5) }}
                      >
                        <div className="letter">
                          {pkgInfo.packageJson.name.split('/').reverse().join('').substring(0, 1).toLocaleLowerCase()}
                        </div>
                        <div
                          className="circle"
                          style={{ background: getPastelColor(getNumberFromString(pkgInfo.packageJson.name)) }}
                        />
                      </div>
                      <div className="info">
                        <div className="title">
                          {pkgInfo.packageJson.name} v{pkgInfo.packageJson.version}
                        </div>
                        <div className="details">{pkgInfo.packageJson.description}</div>
                      </div>
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
        <ExtensionInfo extension={selectedPackage} onClickBackBtn={() => setSelectedPackage(undefined)} />
      )}
    </>
  )
}
InstallExtension.displayName = 'InstallExtension'
export default InstallExtension
