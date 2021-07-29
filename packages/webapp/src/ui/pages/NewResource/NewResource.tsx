import ProgressState from '../../components/atoms/ProgressState/ProgressState'
import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import './styles.scss'
import { UploadResource, UploadResourceProps } from './UploadResource/UploadResource'

export type NewResourceState = 'UploadResource' |'Collections' | 'ExtraData'
export type NewResourceProgressState = [NewResourceState, string][]

export type NewResourceProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  uploadResource: UploadResourceProps
  states: NewResourceProgressState
  currentState: NewResourceState
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
