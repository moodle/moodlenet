import { Card, Switch } from '@moodlenet/component-library'
import type { useFormik } from 'formik'
import type { FC } from 'react'
import { useCallback } from 'react'
import './Advanced.scss'

export type AdvancedFormValues = {
  devMode: boolean
}

export type AdvancedProps = {
  form: ReturnType<typeof useFormik<AdvancedFormValues>>
}

export const AdvancedMenu = () => <abbr title="Advanced">Advanced</abbr>

export const Advanced: FC<AdvancedProps> = ({ form }) => {
  // const canSubmit = form.dirty && form.isValid && !form.isSubmitting && !form.isValidating
  // const [devMode, setDevMode] = useState(false)
  const toggleDevMode = useCallback(() => {
    form.submitForm()
  }, [form])
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
              toggleSwitch={toggleDevMode}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
