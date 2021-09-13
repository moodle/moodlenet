import { Trans } from '@lingui/macro'
import { FC } from 'react'
import { CP } from '../../../lib/ctrl'
import Card from '../../atoms/Card/Card'
import { ResourceCard, ResourceCardProps } from '../ResourceCard/ResourceCard'
import './styles.scss'

export type ResourceItem<Id = any> = { props: CP<ResourceCardProps>; id: Id }
export type AddResourcesCardProps = {
  toggleResource: (selectedResource: CP<ResourceCardProps>) => unknown
  value?: ResourceItem[] | undefined
  resourceCardPropsList: CP<ResourceCardProps>[]
  header?: boolean
  noCard?: boolean
}

export const AddResourcesCard: FC<AddResourcesCardProps> = ({
  resourceCardPropsList,
  value,
  header,
  noCard,
  toggleResource,
}) => {
  console.log({ value })

  const resourceList = resourceCardPropsList.map((resourceCardProps, index) => {
    return (
      <ResourceCard
        key={index}
        onClick={() => toggleResource(resourceCardProps)}
        {...resourceCardProps}
      />
    )
  })

  return (
    <div className="add-resources-card">
      <div className="content">
        <Card noCard={noCard}>
          {header && (
            <div className="resources-header">
              <Trans>Select Resources</Trans>
              {/*<Searchbox setSearchText={setSearchText} searchText="" placeholder={t`Find more resources`} />*/}
            </div>
          )}
          <div className="resources">{resourceList}</div>
        </Card>
      </div>
    </div>
  )
}

AddResourcesCard.defaultProps = {
  header: true,
}
