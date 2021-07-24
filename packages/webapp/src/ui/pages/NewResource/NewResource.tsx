import { CollectionCardProps } from '../../components/cards/CollectionCard/CollectionCard'
import { OverallCardProps } from '../../components/cards/OverallCard/OverallCard'
import { ResourceCardProps } from '../../components/cards/ResourceCard/ResourceCard'
import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import './styles.scss'
import { UploadResource, UploadResourceProps } from './UploadResource/UploadResource'

export type NewResourceProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  overallCardProps: OverallCardProps
  uploadResource: UploadResourceProps
  collectionCardPropsList: CP<CollectionCardProps>[]
  resourceCardPropsList: CP<ResourceCardProps>[]
  username: string
  state: 'Initial' | 'MainData' |'Collections' | 'ExtraData'
}

export const NewResource = withCtrl<NewResourceProps>(
  ({
    headerPageTemplateProps,
    overallCardProps,
    collectionCardPropsList,
    resourceCardPropsList,
    uploadResource,
    username,
    state
  }) => {
    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <div className="new-resource">
          <div className="progress-header">
            <div className="title"><span>1</span>Upload Resource</div>
            <div className={`progress-bar ${state}`}><div></div><div></div><div></div>   
          </div>
          </div>
          <div className="content">
              <UploadResource {...uploadResource} />
          </div>
        </div>
      </HeaderPageTemplate>
    )
  },
)
NewResource.displayName = 'NewResourcePage'
