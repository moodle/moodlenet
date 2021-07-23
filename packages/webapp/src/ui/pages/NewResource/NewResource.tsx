import { t } from '@lingui/macro'
import { CollectionCard, CollectionCardProps } from '../../components/cards/CollectionCard/CollectionCard'
import { ListCard } from '../../components/cards/ListCard/ListCard'
import { OverallCard, OverallCardProps } from '../../components/cards/OverallCard/OverallCard'
import { ResourceCard, ResourceCardProps } from '../../components/cards/ResourceCard/ResourceCard'
import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import './styles.scss'

export type NewResourceProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  overallCardProps: OverallCardProps
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
            <div className="main-column">
              <ListCard
                content={resourceCardPropsList.map(resourcesCardProps => {
                  return <ResourceCard {...resourcesCardProps} />
                })}
                title={t`Latest Resources`}
                className="resources"
              />
              <ListCard
                title={t`Collections curated by ${username}`}
                content={collectionCardPropsList.map(collectionCardProps => (
                  <CollectionCard {...collectionCardProps} />
                ))}
                className="collections"
              />
            </div>
            <div className="side-column">
              <OverallCard {...overallCardProps} />
              <ListCard
                title={t`Collections curated by ${username}`}
                content={collectionCardPropsList.map(collectionCardProps => (
                  <CollectionCard {...collectionCardProps} />
                ))}
                className="collections"
              />
            </div>
          </div>
        </div>
      </HeaderPageTemplate>
    )
  },
)
NewResource.displayName = 'NewResourcePage'
