// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import lib from 'moodlenet-react-app-lib'
import { FC, useContext, useEffect, useMemo, useState } from 'react'
import { getNumberFromString, getPastelColor } from '../helpers/utilities'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
// import { withCtrl } from '../../../../lib/ctrl'
import ExtensionConfig from '../ExtensionConfig/ExtensionConfig'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import { CoreExt, ExtInfo } from '@moodlenet/core'
import { StateContext } from '../ExtensionsProvider'
import './styles.scss'

export type PackagesProps = {
  // menuItemPressed: boolean
}

const { Card, PrimaryButton } = lib.ui.components.atoms

const Packages: FC<PackagesProps> = () => {
  const [extinfoList, setExtInfoList] = useState<ExtInfo[]>([])
  const { selectedExtConfig, setSelectedExtConfig } = useContext(StateContext)

  useEffect(() => {
    lib.priHttp
      .fetch<CoreExt>(
        'moodlenet-core',
        '0.1.10',
      )('ext/listDeployed')()
      .then(({ extInfos }) => setExtInfoList(extInfos))
  }, [])
  const extInfosListElements = useMemo(
    () =>
      extinfoList.map(extInfo => {
        // const [extName, pkgScope] = splitPkgName(extInfo.packageInfo.packageJson.name)
        const extName = extInfo.packageInfo.packageJson.moodlenet.displayName
        return (
          <div
            className="package"
            key={extInfo.packageInfo.installationFolder}
            onClick={() => setSelectedExtConfig(extInfo)}
          >
            {/* <PackageIcon /> */}
            <div
              className="logo"
              style={{
                background: /* extName === 'moodlenet-core' ? '#fdb068' :  */ getPastelColor(
                  getNumberFromString(extName),
                  0.5,
                ),
              }}
            >
              <div className="letter">{extName.substring(0, 1).toLocaleLowerCase()}</div>
              <div
                className="circle"
                style={{
                  background: /* extName === 'moodlenet-core' ? '#f88012' :  */ getPastelColor(
                    getNumberFromString(extName),
                  ),
                }}
              />
            </div>
            <div className="info">
              <div className="title">
                {extName}
                {/*pkgScope && `@ ${pkgScope}`*/}
              </div>
              <div className="description">{extInfo.packageInfo.packageJson.description}</div>
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
            <div className="title">Installed extensions</div>
            <div className="list">{extInfosListElements}</div>
          </Card>
        </div>
      )}
      {selectedExtConfig && (
        <ExtensionConfig extInfo={selectedExtConfig} onClickBackBtn={() => setSelectedExtConfig(null)} />
      )}
    </>
  )
}
Packages.displayName = 'Packages'
export default Packages
