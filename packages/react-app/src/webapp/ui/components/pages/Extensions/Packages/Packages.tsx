// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { FC, useState } from 'react'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
// import { withCtrl } from '../../../../lib/ctrl'
import Card from '../../../atoms/Card/Card'
import InputTextField from '../../../atoms/InputTextField/InputTextField'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import Switch from '../../../atoms/Switch/Switch'
import { packagesFake } from '../fakeData'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import './styles.scss'

export type PackagesProps = {
  // menuItemPressed: boolean
}

const Packages: FC<PackagesProps> = () => {
  // const [npmField, setNpmField] = useState('')
  const [localPathField, setLocalPathField] = useState('')
  const [selectedPackage, setSelectedPackage] = useState<string | undefined>(undefined)

  const packagesList = packagesFake.map((packages, i) => (
    <div className="package" key={i} onClick={() => setSelectedPackage(packages.name)}>
      {/* <PackageIcon /> */}
      {packages.name}
    </div>
  ))

  const modulesList = packagesFake
    .find(n => n.name === selectedPackage)
    ?.modules.map((module, i) => (
      <div className="module" key={i}>
        {/* <PackageIcon /> */}
        <div className="name">{module.name}</div>
        <Switch enabled={module.enabled} mandatory={module.mandatory} />
      </div>
    ))

  // useEffect(() => {

  // }, [menuItemPressed])

  return (
    <div className="packages">
      {!selectedPackage && (
        <div className="home-packages-view">
          <Card className="install">
            <div className="title">Install package</div>
            <div>Use the more suitable Packages option</div>
            {/* <div className="option">
          <div className="name">Npm</div>
          <div className="actions">
            <InputTextField
              className="package-name"
              placeholder="Package name"
              value={npmField}
              onChange={t => setNpmField(t.currentTarget.value)}
              name="package-name"
              edit
              // error={shouldShowErrors && editForm.errors.displayName}
            />
            <PrimaryButton disabled={npmField === ''}>Packages</PrimaryButton>
          </div>
        </div> */}
            <div className="option">
              <div className="name">Local path</div>
              <div className="actions">
                <InputTextField
                  className="local-path"
                  placeholder="Local path to package"
                  value={localPathField}
                  onChange={(t: any) => setLocalPathField(t.currentTarget.value)}
                  name="package-name"
                  // displayMode={true}
                  edit
                  // error={shouldShowErrors && editForm.errors.displayName}
                />
                <PrimaryButton disabled={localPathField === ''}>Install</PrimaryButton>
              </div>
            </div>
          </Card>
          <Card className="installed-packages">
            <div className="title">Installed packages</div>
            <div className="list">{packagesList}</div>
          </Card>
        </div>
      )}
      {selectedPackage && (
        <div className="single-package-view">
          <Card className="header">
            <div className="title">
              {/* <KeyboardBackspaceIcon className="back" /> */}
              {selectedPackage}
            </div>
            <div>Manage package and modules</div>
          </Card>
          <Card className="modules">
            <div className="title">Modules</div>
            <div className="list">{modulesList}</div>
          </Card>
        </div>
      )}
    </div>
  )
}
Packages.displayName = 'Packages'
export default Packages
