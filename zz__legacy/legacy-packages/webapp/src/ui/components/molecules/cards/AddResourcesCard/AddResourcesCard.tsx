import { t, Trans } from '@lingui/macro'
import { FC } from 'react'
import { CP } from '../../../../lib/ctrl'
import Card from '../../../atoms/Card/Card'
import Searchbox from '../../../atoms/Searchbox/Searchbox'
import { ResourceCard, ResourceCardProps } from '../ResourceCard/ResourceCard'
import './styles.scss'

export type ResourceItem<Id = any> = { props: CP<ResourceCardProps>; id: Id }
export type AddResourcesCardProps = {
  toggleResource: (selectedResource: CP<ResourceCardProps>) => unknown
  setSearchText?(text: string): unknown
  resourceCardPropsList: CP<ResourceCardProps>[]
  title?: boolean
  noCard?: boolean
}

export const AddResourcesCard: FC<AddResourcesCardProps> = ({
  resourceCardPropsList,
  title,
  noCard,
  toggleResource,
  setSearchText,
}) => {
  const resourceList =
    resourceCardPropsList &&
    resourceCardPropsList.map((resourceCardProps, index) => {
      return (
        <ResourceCard
          key={index}
          onClick={() => toggleResource(resourceCardProps)}
          {...resourceCardProps}
        />
      )
    })

  return (
    <Card noCard={noCard} className="add-resources-card">
      {(title || setSearchText) && (
        <div className="resources-header">
          {title && (
            <div className="title">
              <Trans>Select Resources</Trans>
            </div>
          )}
          {setSearchText && (
            <Searchbox
              setSearchText={setSearchText}
              searchText=""
              placeholder={t`Find more resources`}
            />
          )}
        </div>
      )}
      <div className="resources-container scroll">
        <div className="resources">{resourceList}</div>
      </div>
    </Card>
  )
}

AddResourcesCard.defaultProps = {
  title: true,
}
