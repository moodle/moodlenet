import {
  InputTextField,
  Modal,
  PrimaryButton,
  SecondaryButton,
  Snackbar,
} from '@moodlenet/component-library'
import { useFormik } from 'formik'
import type { FC, SetStateAction } from 'react'
import { useState } from 'react'
import { reportFormValidationSchema } from '../../../../../common/data.mjs'
import './ReportModal.scss'

export type ReportModalDirection = 'horizontal' | 'vertical'

export type ReportModalProps = {
  title: string
  report(comment: string): void
  setIsReporting: (value: SetStateAction<boolean>) => void
  className?: string
}

export const ReportModal: FC<ReportModalProps> = ({ title, className, report, setIsReporting }) => {
  const [showReportedAlert, setShowReportedAlert] = useState<boolean>(false)
  const [showReportModal, setShowReportModal] = useState<boolean>(true)
  const [shouldShowErrors, setShouldShowErrors] = useState<boolean>(false)
  const form = useFormik<{ comment: string }>({
    initialValues: { comment: '' },
    validationSchema: reportFormValidationSchema,
    onSubmit: (values, { resetForm }) => {
      resetForm()
      report(values.comment)
      setShouldShowErrors(false)
      setShowReportModal(false)
      setShowReportedAlert(false)
      setTimeout(() => {
        setShowReportedAlert(true)
      }, 100)
      setTimeout(() => {
        setIsReporting(false)
      }, 6000)
    },
  })

  const sendReport = () => {
    if (form.isValid) {
      form.submitForm()
    } else {
      setShouldShowErrors(true)
    }
  }

  const snackbars = [
    showReportedAlert && (
      <Snackbar type="success" position="bottom" autoHideDuration={6000} showCloseButton={false}>
        Reported
      </Snackbar>
    ),
  ]

  const canSubmit = form.dirty && !form.isSubmitting && !form.isValidating

  return (
    <>
      {snackbars}
      {showReportModal && (
        <Modal
          className={'report-modal ' + className}
          title={title}
          closeButton={false}
          actions={
            <>
              <SecondaryButton
                color="grey"
                onClick={() => {
                  setIsReporting(false)
                }}
              >
                {/* <Trans> */}
                Cancel
                {/* </Trans> */}
              </SecondaryButton>
              <PrimaryButton onClick={sendReport} disabled={!canSubmit}>
                Report
              </PrimaryButton>
            </>
          }
          onClose={() => setIsReporting(false)}
          style={{ maxWidth: '400px' }}
        >
          <InputTextField
            isTextarea={true}
            name="comment"
            edit
            placeholder={`This is spam / commercial / not educational / fraud / copyrighted / other reason.`}
            onChange={form.handleChange}
            error={shouldShowErrors && form.errors.comment}
          />
        </Modal>
      )}
    </>
  )
}

ReportModal.defaultProps = {}

export default ReportModal
