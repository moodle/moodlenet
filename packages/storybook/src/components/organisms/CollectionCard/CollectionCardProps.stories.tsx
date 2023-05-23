import type { CollectionCardProps } from '@moodlenet/collection/ui'
import { collectionsCardFactory } from '@moodlenet/collection/ui'
import { getRandomSortedArrayElements } from '@moodlenet/component-library'
import { transformPropsToObjectWithKey } from '@moodlenet/react-app/ui'
import type { PartialDeep } from 'type-fest'
import { getCollectionCardStoryProps } from './CollectionCard.stories.js'

export const getCollectionCardsStoryProps = (
  amount = 8,
  overrides?: PartialDeep<CollectionCardProps>,
): { props: CollectionCardProps; key: string }[] => {
  return getRandomSortedArrayElements(collectionsCardFactory, amount).map(collection => {
    // return getCollectionCardStoryProps({ ...collection, ...overrides })
    const newCollection = getCollectionCardStoryProps({
      ...collection,
      ...overrides,
    })
    return transformPropsToObjectWithKey(newCollection, collection.data?.id ?? '')
  })
}
