import { AddonItem, Card, PrimaryButton, Switch } from '@moodlenet/component-library'
import { useFormik } from 'formik'
import { FC, useState } from 'react'
import './Advanced.scss'

export type AdvancedFormValues = {
  devMode: boolean
}

export type AdvancedProps = {
  form: ReturnType<typeof useFormik<AdvancedFormValues>>
}

export const AdvancedMenu: AddonItem = 
{
  Item: () => <span>Advanced</span>,
  key: 'menu-Advanced',
}


export const Advanced: FC<AdvancedProps> = ({ form }) => {
  const canSubmit = form.dirty && form.isValid && !form.isSubmitting && !form.isValidating
  const [devMode, setDevMode] = useState(false)

  return (
    <div className="advanced" key="advanced">
      <Card className="column">
        <div className="title">
          {/* <Trans> */}
          Advanced
          {/* </Trans> */}
          <PrimaryButton onClick={form.submitForm} disabled={!canSubmit} className="save-btn">
            Save
          </PrimaryButton>
        </div>
        <div className="parameter">
          <div className="name">Developer mode</div>
          <div className="actions">
            <Switch
              className="toggle-dev-mode"
              enabled={devMode}
              // enabled={form.values.devMode}
              toggleSwitch={() => setDevMode(!devMode)}
              // toggleSwitch={() => form.setValues({ ...form.values, devMode: !form.values.devMode })}
              name="toggleDevMode"
              edit
              // error={shouldShowErrors && editForm.errors.displayName}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
