// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import lib from 'moodlenet-react-app-lib'
import { FC, useEffect, useState } from 'react'
import { ExtensionsManagerExt } from '../..'
import { SearchPackagesResObject, SearchPackagesResponse } from '../../types/data'
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
const PrimaryButton = lib.ui.components.atoms.PrimaryButton

const InstallExtension: FC<InstallExtensionProps> = () => {
  const [selectedPackage, setSelectedPackage] = useState<SearchPackagesResObject>()
  const [searchPkgResp, setSearchPkgResp] = useState<SearchPackagesResponse>()

  useEffect(() => {
    lib.priHttp
      .fetch<ExtensionsManagerExt>(
        'moodlenet-extensions-manager',
        '0.1.10',
      )('searchPackages')({ searchText: 'moodlenet' })
      .then(resp => setSearchPkgResp(resp))
  }, [])

  return (
    <>
      {!selectedPackage && (
        <div className="search-extensions">
          <Card className="install">
            <div className="title">Add extension...</div>
          </Card>
          <Card className="available-extensions">
            <div className="title">Compatible extensions</div>
            <div className="list">
              {searchPkgResp?.objects.map(respObj => {
                return (
                  <div
                    className="package"
                    key={respObj.name}
                    onClick={() => setSelectedPackage(respObj)} /* onClick={() => setSelectedPackage(o.package.name)} */
                  >
                    {/* <PackageIcon /> */}
                    <div className="left" onClick={() => setSelectedPackage(respObj)}>
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
                          {respObj.name} v{respObj.version}
                        </div>
                        <div className="details">{respObj.description}</div>
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
        <ExtensionInfo searchPackagesResObject={selectedPackage} onClickBackBtn={() => setSelectedPackage(undefined)} />
      )}
    </>
  )
}
InstallExtension.displayName = 'InstallExtension'
export default InstallExtension
