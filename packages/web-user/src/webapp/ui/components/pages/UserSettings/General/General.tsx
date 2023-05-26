/* eslint-disable prettier/prettier */
import type { AddonItem } from '@moodlenet/component-library'
import {
  Card,
  InputTextField,
  Modal,
  PrimaryButton,
  SecondaryButton,
  Snackbar,
  SnackbarStack,
} from '@moodlenet/component-library'
import { useFormik } from 'formik'
import type { FC } from 'react'
import { useState } from 'react'
import './General.scss'

export type GeneralSettingsData = {
  email: string
  password: string
}

export type GeneralProps = {
  data: GeneralSettingsData
  saveSuccess: boolean
  mainColumnItems: (AddonItem | null)[]
  emailChangedSuccess: boolean
  passwordChangedSuccess: boolean
  editData: (values: GeneralSettingsData) => void
  deleteAccount: () => void
  deleteAccountSuccess: boolean
}

export const GeneralMenu = () => <abbr title="General">General</abbr>

export const General: FC<GeneralProps> = ({
  data,
  editData,
  deleteAccount,
  mainColumnItems,
  deleteAccountSuccess,
  emailChangedSuccess,
  passwordChangedSuccess,
}) => {
  const form = useFormik<GeneralSettingsData>({
    initialValues: data,
    // validationSchema: resourceValidationSchema,
    onSubmit: values => {
      return editData(values)
    },
  })

  const canSubmit =
    form.dirty &&
    form.isValid &&
    !form.isSubmitting &&
    !form.isValidating &&
    (form.values.email !== data.email || form.values.password !== data.password)

  const shouldShowErrors = !!form.submitCount
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)

  const updatedMainColumnItems = [...(mainColumnItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  const snackbars = (
    <SnackbarStack
      snackbarList={[
        emailChangedSuccess ? (
          <Snackbar type="success">Check your old email inbox to continue</Snackbar>
        ) : null,
        passwordChangedSuccess ? <Snackbar type="success">Password changed</Snackbar> : null,
        deleteAccountSuccess ? (
          <Snackbar type="success">Check your email to confirm the deletion</Snackbar>
        ) : null,
      ]}
    ></SnackbarStack>
  )

  const modals = (
    <>
      {showDeleteAccountModal && (
        <Modal
          title={`Alert`}
          actions={
            <PrimaryButton
              onClick={() => {
                deleteAccount()
                setShowDeleteAccountModal(false)
              }}
              color="red"
            >
              Delete account
            </PrimaryButton>
          }
          onClose={() => setShowDeleteAccountModal(false)}
          style={{ maxWidth: '400px' }}
          className="delete-message"
        >
          {/* Your account will be deleted. <br /> */}
          {/* Your personal details will be removed. <br /> */}
          {/* Your contributions will be kept as anonymous. <br /> */}
          An email will be send to confirm the deletion of your account.
        </Modal>
      )}
    </>
  )

  return (
    <div className="general" key="general">
      {modals}
      {snackbars}
      <Card className="column">
        <div className="title">
          {/* <Trans> */}
          General
          {/* </Trans> */}
          <PrimaryButton
            onClick={() => form.submitForm()}
            disabled={!canSubmit}
            className="save-btn"
          >
            Save
          </PrimaryButton>
        </div>
      </Card>
      {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      <Card className="column">
        <div className="parameter">
          <div className="name">Email</div>
          <div className="actions">
            <InputTextField
              className="email"
              placeholder="Enter your account email"
              defaultValue={form.values.email}
              onChange={form.handleChange}
              name="email"
              key="email"
              error={shouldShowErrors && form.errors.email}
            />
          </div>
        </div>
        <div className="parameter">
          <div className="name">Password</div>
          <div className="actions">
            <InputTextField
              className="password"
              placeholder="Enter your new password"
              defaultValue={form.values.password}
              onChange={form.handleChange}
              type="password"
              name="password"
              key="password"
              error={shouldShowErrors && form.errors.password}
            />
          </div>
        </div>
      </Card>
      <Card className="column">
        <div className="parameter">
          <div className="name">More</div>
          <div className="actions">
            <SecondaryButton onClick={() => setShowDeleteAccountModal(true)}>
              Delete account
            </SecondaryButton>
          </div>
        </div>
      </Card>
    </div>
  )
}
