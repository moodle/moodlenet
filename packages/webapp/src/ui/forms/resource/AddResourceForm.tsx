import { t, Trans } from '@lingui/macro'
import { FC } from 'react'
import { Button, Form } from 'semantic-ui-react'
import { FormBag } from '../../types/formBag'

export type AddResourceFormData = {
  name: string
  summary: string
  icon: File | null
  resource: File | null
}
export type AddResourceFormProps = {
  form: FormBag<AddResourceFormData>
  cancel(): unknown
}
export const AddResourceForm: FC<AddResourceFormProps> = ({ form, cancel }) => {
  return (
    <>
      <Form disabled={form.isSubmitting}>
        <Form.Group widths="equal">
          <Form.Input
            onChange={form.handleChange}
            fluid
            label={t`Name`}
            placeholder={t`Name`}
            {...form.inputAttrs.name}
          />
          <Form.TextArea
            onChange={form.handleChange}
            label={t`Summary`}
            placeholder={t`Summary`}
            {...form.inputAttrs.summary}
          />
          <Form.Input
            type="file"
            onChange={({ target: { files } }) => {
              const icon = files?.item(0) ?? null
              form.setFieldValue('icon', icon)
            }}
            label={t`Icon`}
            placeholder={t`Icon`}
            {...form.inputAttrs.icon}
          />
          <Form.Input
            type="file"
            onChange={({ target: { files } }) => {
              const resource = files?.item(0) ?? null
              form.setFieldValue('resource', resource)
            }}
            label={t`Resource`}
            placeholder={t`Resource`}
            {...form.inputAttrs.resource}
          />
        </Form.Group>
      </Form>
      <Button onClick={form.submitForm}>
        <Trans>Submit</Trans>
      </Button>
      <Button onClick={cancel}>
        <Trans>Cancel</Trans>
      </Button>
    </>
  )
}
