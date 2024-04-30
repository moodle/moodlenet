import { InputTextField, Modal, PrimaryButton, SecondaryButton } from '@moodlenet/component-library'

import { ArrowForwardIosRounded } from '@mui/icons-material'
import { useState, type FC, type SetStateAction } from 'react'
import type { ReportOptionType, ReportProfileData } from '../../../../../common/types.mjs'
import './ReportProfile.scss'

export type ReportProfileDirection = 'horizontal' | 'vertical'

export type ReportProfileProps = {
  // reportForm: FormikHandle<{
  //   comment: string
  // }>
  reportOptions: ReportOptionType[]
  setIsReporting: (value: SetStateAction<boolean>) => void
  setShowReportedAlert: (value: SetStateAction<boolean>) => void
  reportProfile: (values: ReportProfileData) => void
}

export const ReportProfile: FC<ReportProfileProps> = ({
  // reportForm,
  reportOptions,
  reportProfile,
  setIsReporting,
  setShowReportedAlert,
}) => {
  const [step, setStep] = useState<'options' | 'comment' | 'success'>('options')
  const [option, setOption] = useState<ReportOptionType | undefined>(undefined)
  const [comment, setComment] = useState<string | undefined>(undefined)

  const report = () => {
    // reportForm.submitForm()
    option && reportProfile({ type: option, comment })
    setIsReporting(false)
    setShowReportedAlert(true)
  }

  const Option = ({ id: key, name }: ReportOptionType) => (
    <div
      className="option"
      onClick={() => {
        setStep('comment')
        setOption({ id: key, name })
      }}
      key={key}
    >
      <div className="text">{name}</div>
      <div className="arrow">
        <ArrowForwardIosRounded />
      </div>
    </div>
  )

  const optionsSection = (
    <div className="option-section">
      <div className="title">Why are you reporting this user?</div>
      {reportOptions.map(({ id, name }) => (
        <Option key={id} name={name} id={id} />
      ))}
    </div>
  )

  const commentSection = (
    <div className="comment-section">
      <div className="title">Provide more details (optional)</div>
      <InputTextField
        isTextarea
        name="comment"
        maxLength={500}
        edit
        placeholder={`Example: Shared several malicious links on most recent posts.`}
        onChange={e => setComment(e.target.value)}
        value={comment}
        // onChange={reportForm.handleChange}
      />
      {/* <div className="required">Required field</div> */}
    </div>
  )

  return (
    <Modal
      className={'report-profile'}
      title="Report"
      // closeButton={false}
      actions={
        <>
          {/* <SecondaryButton
            color="grey"
            onClick={() => {
              setIsReporting(false)
            }}
          >
            Cancel
          </SecondaryButton> */}
          {step === 'comment' && (
            <SecondaryButton
              color="grey"
              onClick={() => {
                setStep('options')
              }}
            >
              Back
            </SecondaryButton>
          )}

          {step === 'comment' && (
            <PrimaryButton
              onClick={report}
              // disabled={!!reportForm.errors.comment}
            >
              Report
            </PrimaryButton>
          )}
        </>
      }
      onClose={() => setIsReporting(false)}
      style={{ maxWidth: '400px' }}
    >
      {step === 'options' && optionsSection}
      {step === 'comment' && commentSection}
    </Modal>
  )
}

ReportProfile.defaultProps = {}

export default ReportProfile
