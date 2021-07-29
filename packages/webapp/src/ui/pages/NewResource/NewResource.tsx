import ProgressState from '../../components/atoms/ProgressState/ProgressState'
import { withCtrl } from '../../lib/ctrl'
import { FormikBag } from '../../lib/formik'
import { HeaderPageTemplate } from '../../templates/page/HeaderPageTemplate'
import './styles.scss'
import { NewResourceFormValues } from './types'
import { UploadResource } from './UploadResource/UploadResource'

export type NewResourceState = 'UploadResource' |'Collections' | 'ExtraData'
export type NewResourceProgressState = [NewResourceState, string][]

export type NewResourceProps = {
  form: FormikBag<NewResourceFormValues>
  stepProps: UploadResourceProps | _2StepProps | _3StepProps 
  // headerPageTemplateProps: CP<HeaderPageTemplateProps>
  // uploadResource: UploadResourceProps
  // states: NewResourceProgressState
  // currentState: NewResourceState
}

export const NewResource = withCtrl<NewResourceProps>(
  ({
    headerPageTemplateProps,
    uploadResource,
    states,
    currentState
  }) => {
    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <div className="new-resource">
          <ProgressState states={states} currentState={currentState} />
          <div className="content">
              <UploadResource {...uploadResource} />
          </div>
        </div>
      </HeaderPageTemplate>
    )
  },
)
NewResource.displayName = 'NewResourcePage'
