import {
  InputTextField,
  Modal,
  PrimaryButton,
  Snackbar,
  TertiaryButton,
} from '@moodlenet/component-library'
import { useFormik } from 'formik'
import type { FC } from 'react'
import { useState } from 'react'
import type { SchemaOf } from 'yup'
import { object, string } from 'yup'
import './SendToMoodle.scss.js'

export type SendToMoodleForm = { site: string | undefined }

export type SendToMoodleProps = {
  site: string | undefined
  userId: string | undefined
  sendToMoodle: (site: string | undefined) => void
}

export const lmsValidationSchema: SchemaOf<SendToMoodleForm> = object({
  site: string().url().required(),
})

export const SendToMoodle: FC<SendToMoodleProps> = ({ site, userId, sendToMoodle }) => {
  const [isAddingToMoodleLms, setIsAddingToMoodleLms] = useState<boolean>(false)
  const [shouldShowSendToMoodleLmsError, setShouldShowSendToMoodleLmsError] =
    useState<boolean>(false)
  const [showUserIdCopiedAlert, setShowUserIdCopiedAlert] = useState<boolean>(false)

  const form = useFormik<SendToMoodleForm>({
    initialValues: { site: site },
    validationSchema: lmsValidationSchema,
    onSubmit: async ({ site }, { setErrors }) => {
      try {
        await sendToMoodle(site)
      } catch (e) {
        setErrors({ site: `Couldn't send to your MoodleLMS` })
      }
    },
  })

  const handleOnSendToMoodleClick = () => {
    if (form.isValid) {
      form.submitForm()
      setIsAddingToMoodleLms(false)
      setShouldShowSendToMoodleLmsError(false)
    } else {
      setShouldShowSendToMoodleLmsError(true)
    }
  }

  const copyId = () => {
    userId && navigator.clipboard.writeText(userId)
    setShowUserIdCopiedAlert(false)
    setTimeout(() => {
      setShowUserIdCopiedAlert(true)
    }, 100)
  }

  const copyIdButton = (
    <abbr className={`user-id`} title={`Click to copy your ID to the clipboard`}>
      <TertiaryButton className="copy-id" onClick={copyId}>
        User ID
      </TertiaryButton>
    </abbr>
  )

  const snackbars = [
    showUserIdCopiedAlert && (
      <Snackbar type="success" position="bottom" autoHideDuration={6000} showCloseButton={false}>
        User ID copied to the clipboard, use it to connect with Moodle LMS
      </Snackbar>
    ),
  ]

  const modal = isAddingToMoodleLms && (
    <Modal
      className="send-to-moodle-modal"
      title={`Your Moodle LMS Site`}
      actions={
        <PrimaryButton
          onClick={() => {
            handleOnSendToMoodleClick()
          }}
        >
          Send
        </PrimaryButton>
      }
      onClose={() => {
        setIsAddingToMoodleLms(false)
        setShouldShowSendToMoodleLmsError(false)
      }}
      style={{ maxWidth: '350px', width: '100%' }}
    >
      {snackbars}
      <InputTextField
        placeholder="http://your-moodle-lms-site.com"
        value={form.values.site}
        name="site"
        edit
        onChange={form.handleChange}
        disabled={form.isSubmitting}
        error={shouldShowSendToMoodleLmsError && form.errors.site}
      />
      <div className="user-id-div">
        {userId ? (
          <>You might need your {copyIdButton}</>
        ) : (
          <>
            You might need a <b>User ID</b>, please sign up to get one
          </>
        )}
      </div>
    </Modal>
  )

  return (
    <>
      {modal}
      <PrimaryButton onClick={() => setIsAddingToMoodleLms(true)}>Send to Moodle</PrimaryButton>
    </>
  )
}

SendToMoodle.defaultProps = {}

export default SendToMoodle
