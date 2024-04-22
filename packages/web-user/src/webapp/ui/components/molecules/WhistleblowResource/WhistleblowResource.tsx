import { InputTextField, Modal, PrimaryButton, SecondaryButton } from '@moodlenet/component-library'

import { ArrowForwardIosRounded } from '@mui/icons-material'
import { useState, type FC, type SetStateAction } from 'react'
import './WhistleblowResource.scss'
import { WhistleblowOptionType, WhistleblowResourceData } from './WhistleblowResourceData.js'

export type WhistleblowResourceDirection = 'horizontal' | 'vertical'

export type WhistleblowResourceProps = {
  whistleblowOptions: WhistleblowOptionType[]
  setIsWhistleblowing: (value: SetStateAction<boolean>) => void
  setShowWhistleblowAlert: (value: SetStateAction<boolean>) => void
  whistleblowResource: (values: WhistleblowResourceData) => void
}

export const WhistleblowResource: FC<WhistleblowResourceProps> = ({
  whistleblowOptions,
  whistleblowResource,
  setIsWhistleblowing,
  setShowWhistleblowAlert,
}) => {
  const [step, setStep] = useState<'options' | 'comment' | 'success'>('options')
  const [option, setOption] = useState<WhistleblowOptionType | undefined>(undefined)
  const [comment, setComment] = useState<string | undefined>(undefined)

  const whistleblow = () => {
    option && whistleblowResource({ type: option, comment })
    setIsWhistleblowing(false)
    setShowWhistleblowAlert(true)
  }

  const Option = ({ id: key, name }: WhistleblowOptionType) => (
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
      <div className="title">Why are you whistleblowing this resource?</div>
      {whistleblowOptions.map(({ id, name }) => (
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
        placeholder={`Example: Contains outdated statistics, please verify recent studies.`}
        onChange={e => setComment(e.target.value)}
        value={comment}
      />
    </div>
  )

  return (
    <Modal
      className={'whistleblow-resource'}
      title="Whistleblow"
      actions={
        <>
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
              onClick={whistleblow}
              // disabled={!!reportForm.errors.comment}
            >
              Whistleblow
            </PrimaryButton>
          )}
        </>
      }
      onClose={() => setIsWhistleblowing(false)}
      style={{ maxWidth: '400px' }}
    >
      {step === 'options' && optionsSection}
      {step === 'comment' && commentSection}
    </Modal>
  )
}

WhistleblowResource.defaultProps = {}

export default WhistleblowResource
