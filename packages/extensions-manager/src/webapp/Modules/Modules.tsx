import { FC, useCallback, useContext, useState } from 'react'
// import { withCtrl } from '../../../../lib/ctrl'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import { CoreExt } from '@moodlenet/core'
import { MainContext } from '../MainModule'
import './styles.scss'

export type ModulesProps = {}

const { Card, InputTextField, PrimaryButton } = lib.ui.components
const Modules: FC<ModulesProps> = () => {
  const { shell } = useContext(MainContext)
  const core = shell.pkgHttp<CoreExt>('@moodlenet/core@0.1.0')
  const [localPathField, setLocalPathField] = useState('')
  const install = useCallback(() => {
    if (!localPathField) {
      return
    }
    core.fetch('pkg/install')({
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
