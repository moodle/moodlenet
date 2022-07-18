import { FC, useCallback, useState } from 'react'
// import { withCtrl } from '../../../../lib/ctrl'
import lib from 'moodlenet-react-app-lib'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import { CoreExt } from '@moodlenet/core'
import './styles.scss'

export type ModulesProps = {}

const { Card, InputTextField, PrimaryButton } = lib.ui.components.atoms
const Modules: FC<ModulesProps> = () => {
  const [localPathField, setLocalPathField] = useState('')
  const install = useCallback(() => {
    if (!localPathField) {
      return
    }
    lib.priHttp.fetch<CoreExt>('moodlenet-core', '0.1.10')('pkg/install')({
      installPkgReq: { type: 'symlink', fromFolder: localPathField },
      deploy: true,
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
        </div>{' '}
      </Card>
    </div>
  )
}

Modules.displayName = 'Modules'
export default Modules
