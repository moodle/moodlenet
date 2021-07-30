import { t } from '@lingui/macro'
import ProgressState from '../../components/atoms/ProgressState/ProgressState'
import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import './styles.scss'
import { UploadResource, UploadResourceProps } from './UploadResource/UploadResource'

export type NewResourceState = 'UploadResource' | 'Collections' | 'ExtraData'
export type NewResourceProgressState = [NewResourceState, string][]

export type NewResourceProps = {
  stepProps: UploadResourceProps //| _2StepProps | _3StepProps
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  // uploadResource: UploadResourceProps
  // states: NewResourceProgressState
  // currentState: NewResourceState
}

const progressStates = [t`Upload Resource`, t`Add to Collections`, t`Add Details`]
export const NewResource = withCtrl<NewResourceProps>(({ stepProps, headerPageTemplateProps }) => {
  const progressCurrentIndex = stepProps.step === 'UploadResourceStep' ? 0 : undefined

  if (progressCurrentIndex === undefined) {
    console.error({ stepProps })
    throw new Error(`unknown stepProps: step=${stepProps.step}`)
  }
  const StepComp = stepProps.step === 'UploadResourceStep' ? UploadResource : () => <div>SHOULD NEVER HAPPEN</div>

  return (
    <HeaderPageTemplate {...headerPageTemplateProps}>
      <div className="new-resource">
        <ProgressState stateNames={progressStates} currentIndex={progressCurrentIndex} />
        <div className="content">
          <StepComp {...stepProps} />
        </div>
      </div>
    </HeaderPageTemplate>
  )
})
NewResource.displayName = 'NewResourcePage'
