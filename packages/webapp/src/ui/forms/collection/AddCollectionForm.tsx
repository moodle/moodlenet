import { t, Trans } from '@lingui/macro'
import { FC } from 'react'
import { Button, Form } from 'semantic-ui-react'
import { FormBag } from '../../types/formBag'

export type AddCollectionFormData = {
  name: string
  summary: string
}
export type AddCollectionFormProps = {
  form: FormBag<AddCollectionFormData>
  cancel(): unknown
}
export const AddCollectionForm: FC<AddCollectionFormProps> = ({ form, cancel }) => {
  return (
    <>
      <Form disabled={form.isSubmitting}>
        <Form.Group widths="equal">
          <Form.Input
            onChange={form.handleChange}
            fluid
            label={t`Name`}
            placeholder={t`Name`}
            {...form.valueName.name}
          />
          <Form.TextArea
            onChange={form.handleChange}
            label={t`Summary`}
            placeholder={t`Summary ...`}
            {...form.valueName.summary}
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
