import { FC, useState } from 'react'
// import { withCtrl } from '../../../../lib/ctrl'
import Card from '../../../atoms/Card/Card'
import InputTextField from '../../../atoms/InputTextField/InputTextField'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import './styles.scss'

export type InstallProps = {}

const Install: FC<InstallProps> = () => {
  const [npmField, setNpmField] = useState('')
  const [localPathField, setLocalPathField] = useState('')
  return (
    <div className="install">
      <Card>
        <div className="title">New package</div>
        <div>Use the more suitable install option</div>
        <div className="option">
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
            <PrimaryButton disabled={npmField === ''}>Install</PrimaryButton>
          </div>
        </div>
        <div className="option">
          <div className="name">Local path</div>
          <div className="actions">
            <InputTextField
              className="local-path"
              placeholder="Local path to package"
              value={localPathField}
              onChange={t => setLocalPathField(t.currentTarget.value)}
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
        <div>A list of installed packages</div>
        <div className="list"></div>
      </Card>
    </div>
  )
}

Install.displayName = 'Install'
export default Install
