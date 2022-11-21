import { AddonItem, Card, Switch } from '@moodlenet/component-library'
import { useFormik } from 'formik'
import { FC } from 'react'
import './Advanced.scss'

export type AdvancedFormValues = {
  devMode: boolean
}

export type AdvancedProps = {
  form: ReturnType<typeof useFormik<AdvancedFormValues>>
}

export const AdvancedMenu: AddonItem = {
  Item: () => <span>Advanced</span>,
  key: 'menu-Advanced',
}

export const Advanced: FC<AdvancedProps> = ({ form }) => {
  const canSubmit = form.dirty && form.isValid && !form.isSubmitting && !form.isValidating
  // const [devMode, setDevMode] = useState(false)

  return (
    <div className="advanced" key="advanced">
      <Card className="column">
        <div className="title">
          {/* <Trans> */}
          Advanced
          {/* </Trans> */}
          {/* <PrimaryButton onClick={form.submitForm} disabled={!canSubmit} className="save-btn">
            Save
          </PrimaryButton> */}
        </div>
      </Card>
      <Card className="column">
        <div className="parameter">
          <div className="name">Developer mode</div>
          <div className="actions">
            <Switch
              className="toggle-dev-mode"
              enabled={form.values.devMode}
              toggleSwitch={() => form.setFieldValue('devMode', !form.values.devMode)}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
