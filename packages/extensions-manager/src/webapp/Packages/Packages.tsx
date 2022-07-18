// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import lib from 'moodlenet-react-app-lib'
import { FC, useEffect, useMemo, useState } from 'react'
import { getNumberFromString, getPastelColor } from '../helpers/utilities'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
// import { withCtrl } from '../../../../lib/ctrl'
import ExtensionConfig from '../ExtensionConfig/ExtensionConfig'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import { CoreExt, ExtInfo } from '@moodlenet/core'
import './styles.scss'

export type PackagesProps = {
  // menuItemPressed: boolean
}

const { Card, PrimaryButton } = lib.ui.components.atoms

const Packages: FC<PackagesProps> = () => {
  const [selectedExtInfo, setSelectedExtInfo] = useState<ExtInfo>()
  const [extinfoList, setExtInfoList] = useState<ExtInfo[]>([])

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
        const extName = extInfo.ext.displayName
        return (
          <div
            className="package"
            key={extInfo.packageInfo.installationFolder}
            onClick={() => setSelectedExtInfo(extInfo)}
          >
            {/* <PackageIcon /> */}
            <div
              className="logo"
              style={{
                background:
                  extName === 'moodlenet-core' ? '#fdb068' : getPastelColor(getNumberFromString(extName), 0.5),
              }}
            >
              <div className="letter">{extName.substring(0, 1).toLocaleLowerCase()}</div>
              <div
                className="circle"
                style={{
                  background: extName === 'moodlenet-core' ? '#f88012' : getPastelColor(getNumberFromString(extName)),
                }}
              />
            </div>
            <div className="info">
              <div className="title">{extName}</div>
              <div className="details">{extInfo.ext.description}</div>
            </div>
            <PrimaryButton className="install-btn">Config</PrimaryButton>
          </div>
        )
      }),
    [extinfoList],
  )

  return (
    <>
      {!selectedExtInfo && (
        <div className="packages">
          <Card className="installed-packages">
            <div className="title">Installed extensions</div>
            <div className="list">{extInfosListElements}</div>
          </Card>
        </div>
      )}
      {selectedExtInfo && (
        <ExtensionConfig extInfo={selectedExtInfo} onClickBackBtn={() => setSelectedExtInfo(undefined)} />
      )}
    </>
  )
}
Packages.displayName = 'Packages'
export default Packages
