import { t } from '@lingui/macro'
import ProgressState from '../../components/atoms/ProgressState/ProgressState'
import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import { AddToCollections, AddToCollectionsProps } from './AddToCollections/AddToCollections'
import './styles.scss'
import { UploadResource, UploadResourceProps } from './UploadResource/UploadResource'

export type NewResourceState = 'UploadResource' | 'AddToCollections' | 'ExtraData'
export type NewResourceProgressState = [NewResourceState, string][]

export type NewResourceProps = {
  stepProps: UploadResourceProps | AddToCollectionsProps //| _3StepProps
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  // uploadResource: UploadResourceProps
  // states: NewResourceProgressState
  // currentState: NewResourceState
}

const progressStates = [t`Upload Resource`, t`Add to Collections`, t`Add Details`]
export const NewResource = withCtrl<NewResourceProps>(({ stepProps, headerPageTemplateProps }) => {
  const progressCurrentIndex = stepProps.step === 'UploadResourceStep' ? 0 : 
  stepProps.step === 'AddToCollectionsStep' ? 1 : undefined

  if (progressCurrentIndex === undefined) {
    console.error({ stepProps })
    throw new Error(`unknown stepProps: step=${stepProps.step}`)
  }

  return (
    <HeaderPageTemplate {...headerPageTemplateProps}>
      <div className="new-resource">
        <ProgressState stateNames={progressStates} currentIndex={progressCurrentIndex} />
        <div className="content">
          {stepProps.step === 'UploadResourceStep' ? (
            <UploadResource {...stepProps} />
          ) : stepProps.step === 'AddToCollectionsStep' ? (
            <AddToCollections {...stepProps} />
          ) : (
            <div>Should never happen</div>
          )}
        </div>
      </div>
    </HeaderPageTemplate>
  )
})
NewResource.displayName = 'NewResourcePage'
