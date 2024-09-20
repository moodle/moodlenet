import {
  InputTextField,
  Modal,
  PrimaryButton,
  Snackbar,
  TertiaryButton,
  useSnackbar,
} from '@moodlenet/component-library'
import { useFormik } from 'formik'
import type { FC } from 'react'
import { useState } from 'react'
import type { SchemaOf } from 'yup'
import { object, string } from 'yup'
import './SendToMoodle.scss'

export type SendToMoodleForm = { site: string | undefined }

export type SendToMoodleProps = {
  site: string | undefined
  userId: string | undefined
  canSendToMoodle: boolean
  sendToMoodle: (site: string | undefined) => void
}

export const lmsValidationSchema: SchemaOf<SendToMoodleForm> = object({
  site: string().url().required(),
})

export const SendToMoodle: FC<SendToMoodleProps> = ({
  site,
  userId,
  canSendToMoodle,
  sendToMoodle,
}) => {
  const [isAddingToMoodleLms, setIsAddingToMoodleLms] = useState<boolean>(false)
  const [shouldShowSendToMoodleLmsError, setShouldShowSendToMoodleLmsError] =
    useState<boolean>(false)
  const { addSnackbar } = useSnackbar()

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
    const site = form.values.site
    if (site?.trim() !== '' && site?.substring(0, 4).toLowerCase() !== 'http') {
      form.setFieldValue('site', `https://${site}`)
    }
    if (form.isValid) {
      form.submitForm()
      setIsAddingToMoodleLms(false)
      setShouldShowSendToMoodleLmsError(false)
      showSendSuccess()
    } else {
      setShouldShowSendToMoodleLmsError(true)
    }
  }

  const copyId = () => {
    if (userId) {
      navigator.clipboard.writeText(userId)
      addSnackbar(
        <Snackbar type="success" position="bottom" autoHideDuration={5000} showCloseButton={false}>
          User ID copied to the clipboard, use it to connect with Moodle LMS
        </Snackbar>,
      )
    }
  }

  const copyIdButton = (
    <abbr className={`user-id`} title={`Click to copy your ID to the clipboard`}>
      <TertiaryButton className="copy-id" onClick={copyId}>
        User ID
      </TertiaryButton>
    </abbr>
  )

  const showSendSuccess = () => {
    addSnackbar(
      <Snackbar type="success" position="bottom" autoHideDuration={3000} showCloseButton={false}>
        Resource sent to {form.values.site}
      </Snackbar>,
    )
  }

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
      onPressEnter={() => {
        handleOnSendToMoodleClick()
      }}
      onClose={() => {
        setIsAddingToMoodleLms(false)
        setShouldShowSendToMoodleLmsError(false)
      }}
      style={{ maxWidth: '350px', width: '100%' }}
    >
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
      {canSendToMoodle ? modal : null}
      <PrimaryButton
        onClick={() => canSendToMoodle && setIsAddingToMoodleLms(true)}
        disabled={!canSendToMoodle}
      >
        Send to Moodle
      </PrimaryButton>
    </>
  )
}

SendToMoodle.defaultProps = {}

export default SendToMoodle
