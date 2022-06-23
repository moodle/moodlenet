// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { FC, useState } from 'react'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
// import { withCtrl } from '../../../../lib/ctrl'
import Card from '../../../atoms/Card/Card'
import ExtensionConfig from '../ExtensionConfig/ExtensionConfig'
import { Package, packagesFake } from '../fakeData'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import './styles.scss'

export type PackagesProps = {
  // menuItemPressed: boolean
}

const Packages: FC<PackagesProps> = () => {
  const [selectedPackage, setSelectedPackage] = useState<Package | undefined>(undefined)

  const packagesList = packagesFake.map((p, i) => (
    <div className="package" key={i} onClick={() => setSelectedPackage(p)}>
      {/* <PackageIcon /> */}
      <div className="logo">
        <div className="circle" />
      </div>
      <div className="info">
        <div className="title">{p.name}</div>
        <div className="details">{p.creator}</div>
      </div>
    </div>
  ))

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
