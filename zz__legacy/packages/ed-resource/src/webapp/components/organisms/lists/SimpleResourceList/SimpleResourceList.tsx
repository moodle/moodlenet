import { ListCard } from '@moodlenet/component-library'
import type { ProxyProps } from '@moodlenet/react-app/ui'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { ResourceCardPropsData } from '../../ResourceCard/ResourceCard.js'
import ResourceCard from '../../ResourceCard/ResourceCard.js'
import './SimpleResourceList.scss'

export type SimpleResourceListProps = {
  resourceCardPropsList: { key: string; props: ProxyProps<ResourceCardPropsData> }[]
  title?: string
}

export const SimpleResourceList: FC<SimpleResourceListProps> = ({
  resourceCardPropsList,
  title,
}) => {
  const listCard = (
    <ListCard
      className="simple-resource-list resources"
      content={useMemo(
        () =>
          resourceCardPropsList.map(({ key, props }) => {
            return { key, el: <ResourceCard key={key} {...props} orientation="horizontal" /> }
          }),
        [resourceCardPropsList],
      )}
      header={title}
    />
  )

  return resourceCardPropsList.length > 0 ? listCard : null
}

SimpleResourceList.defaultProps = {}

export default SimpleResourceList
