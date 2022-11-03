import { FC, useCallback, useContext, useState } from 'react'
// import { withCtrl } from '../../../../lib/ctrl'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import { Card, InputTextField, PrimaryButton } from '@moodlenet/component-library'
import { MainContext } from '../MainContext.js'
import './styles.scss'

export type ModulesProps = {}

const Modules: FC<ModulesProps> = () => {
  const { pkgs } = useContext(MainContext)
  const [myPkg] = pkgs
  const [localPathField, setLocalPathField] = useState('')
  const install = useCallback(() => {
    if (!localPathField) {
      return
    }
    myPkg.call('install')({
      installPkgReq: { type: 'symlink', fromFolder: localPathField },
    })
  }, [localPathField])
  return (
    <div className="modules">
      <Card>
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
            <PrimaryButton disabled={localPathField === ''} onClick={install}>
              Install
            </PrimaryButton>
          </div>
        </div>
      </Card>
    </div>
  )
}

Modules.displayName = 'Modules'
export default Modules
