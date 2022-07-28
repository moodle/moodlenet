// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import lib from 'moodlenet-react-app-lib'
import { FC, useContext, useEffect, useMemo, useState } from 'react'
import { getNumberFromString, getPastelColor } from '../helpers/utilities'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
// import { withCtrl } from '../../../../lib/ctrl'
import ExtensionConfig from '../ExtensionConfig/ExtensionConfig'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import { CoreExt, PackageInfo } from '@moodlenet/core'
import { extNameDescription } from '../../lib'
import { StateContext } from '../ExtensionsProvider'
import './styles.scss'

export type PackagesProps = {
  // menuItemPressed: boolean
}

const { Card, PrimaryButton } = lib.ui.components

const Packages: FC<PackagesProps> = () => {
  const [extinfoList, setExtInfoList] = useState<PackageInfo[]>([])
  const { selectedExtConfig, setSelectedExtConfig } = useContext(StateContext)

  useEffect(() => {
    lib.priHttp
      .fetch<CoreExt>(
        '@moodlenet/core',
        '0.1.0',
      )('ext/listDeployed')()
      .then(({ pkgInfos }) => setExtInfoList(pkgInfos))
  }, [])
  const extInfosListElements = useMemo(
    () =>
      extinfoList.map(pkgInfo => {
        // const [extName, pkgScope] = splitPkgName(extInfo.packageInfo.packageJson.name)

        var { displayName, description } = extNameDescription(pkgInfo.packageJson)
        // const extName = extInfo.packageInfo.packageJson.@moodlenet/displayName
        return (
          <div className="package" key={pkgInfo.id} onClick={() => setSelectedExtConfig(pkgInfo)}>
            {/* <PackageIcon /> */}
            <div
              className="logo"
              style={{
                background: /* extName === '@moodlenet/core' ? '#fdb068' :  */ getPastelColor(
                  getNumberFromString(displayName),
                  0.5,
                ),
              }}
            >
              <div className="letter">{displayName.substring(0, 1).toLocaleLowerCase()}</div>
              <div
                className="circle"
                style={{
                  background: /* extName === '@moodlenet/core' ? '#f88012' :  */ getPastelColor(
                    getNumberFromString(displayName),
                  ),
                }}
              />
            </div>
            <div className="info">
              <div className="title">
                {displayName}
                {/*pkgScope && `@ ${pkgScope}`*/}
              </div>
              <div className="description">{description}</div>
              {/* <div className="creator">{pkgScope}</div> */}
            </div>
            <PrimaryButton className="install-btn">Details</PrimaryButton>
          </div>
        )
      }),
    [extinfoList],
  )

  return (
    <>
      {!selectedExtConfig && (
        <div className="packages">
          <Card className="installed-packages">
            <div className="title">Manage extensions</div>
            <div className="list">{extInfosListElements}</div>
          </Card>
        </div>
      )}
      {selectedExtConfig && (
        <ExtensionConfig pkgInfo={selectedExtConfig} onClickBackBtn={() => setSelectedExtConfig(null)} />
      )}
    </>
  )
}
Packages.displayName = 'Packages'
export default Packages
