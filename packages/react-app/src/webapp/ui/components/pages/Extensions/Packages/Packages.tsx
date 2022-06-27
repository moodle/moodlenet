// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { FC, useState } from 'react'
import { getNumberFromString, getPastelColor } from '../../../../../helpers/utilities'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
// import { withCtrl } from '../../../../lib/ctrl'
import Card from '../../../atoms/Card/Card'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import ExtensionConfig from '../ExtensionConfig/ExtensionConfig'
import { Package, packagesFake } from '../fakeData'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import './styles.scss'

export type PackagesProps = {
  // menuItemPressed: boolean
}

const Packages: FC<PackagesProps> = () => {
  const [selectedPackage, setSelectedPackage] = useState<Package | undefined>(undefined)

  const packagesList = packagesFake.map((p, i) => {
    const id = getNumberFromString(p.name)
    return (
      <div className="package" key={i} onClick={() => setSelectedPackage(p)}>
        {/* <PackageIcon /> */}
        <div className="left" onClick={() => setSelectedPackage(p)}>
          <div className="logo" style={{ background: p.name === 'Core' ? '#fdb068' : getPastelColor(id, 0.5) }}>
            <div className="letter">{p.name && p.name[0]?.toLocaleLowerCase()}</div>
            <div className="circle" style={{ background: p.name === 'Core' ? '#f88012' : getPastelColor(id) }} />
          </div>
          <div className="info">
            <div className="title">{p.name}</div>
            <div className="details">{p.creator}</div>
          </div>
        </div>
        <PrimaryButton
          className="install-btn"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            alert('installing')
            e.stopPropagation()
          }}
        >
          Details
        </PrimaryButton>
      </div>
    )
  })

  return (
    <>
      {!selectedPackage && (
        <div className="packages">
          <Card className="installed-packages">
            <div className="title">Installed extensions</div>
            <div className="list">{packagesList}</div>
          </Card>
        </div>
      )}
      {selectedPackage && (
        <ExtensionConfig extension={selectedPackage} onClickBackBtn={() => setSelectedPackage(undefined)} />
      )}
    </>
  )
}
Packages.displayName = 'Packages'
export default Packages
