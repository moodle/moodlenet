import { t, Trans } from '@lingui/macro'
import { FC, SetStateAction } from 'react'
import { FormikHandle } from '../../../../lib/formik'
import InputTextField from '../../../atoms/InputTextField/InputTextField'
import Modal from '../../../atoms/Modal/Modal'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../atoms/SecondaryButton/SecondaryButton'
import './styles.scss'

export type ReportModalDirection = 'horizontal' | 'vertical'

export type ReportModalProps = {
  title: string
  reportForm: FormikHandle<{
    comment: string
  }>
  setIsReporting: (value: SetStateAction<boolean>) => void
  setShowReportedAlert: (value: SetStateAction<boolean>) => void
  className?: string
}

export const ReportModal: FC<ReportModalProps> = ({
  title,
  className,
  reportForm,
  setIsReporting,
  setShowReportedAlert,
}) => {
  return (
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
            <Trans>Cancel</Trans>
          </SecondaryButton>
          <PrimaryButton
            onClick={() => {
              reportForm.submitForm()
              setIsReporting(false)
              setShowReportedAlert(false)
              setTimeout(() => {
                setShowReportedAlert(true)
              }, 100)
            }}
            disabled={!!reportForm.errors.comment}
          >
            <Trans>Report</Trans>
          </PrimaryButton>
        </>
      }
      onClose={() => setIsReporting(false)}
      style={{ maxWidth: '400px' }}
    >
      <InputTextField
        textarea={true}
        name="comment"
        edit
        placeholder={t`This is spam / commercial / not educational / fraud / copyrighted / other reason.`}
        onChange={reportForm.handleChange}
      />
      <div className="required">
        <Trans>Required field</Trans>
      </div>
    </Modal>
  )
}

ReportModal.defaultProps = {}

export default ReportModal
