import { getRandomSortedArrayElements } from '@moodlenet/component-library'
import { collectionsCardFactory } from '../../../helpers/factories.js'
import { CollectionCardProps } from './CollectionCard.js'
import { getCollectionCardStoryProps } from './CollectionCard.stories.js'

export const getCollectionsCardStoryProps = (
  amount = 8,
  overrides?: Partial<CollectionCardProps>,
): CollectionCardProps[] => {
  return getRandomSortedArrayElements(collectionsCardFactory, amount).map(collection => {
    return getCollectionCardStoryProps(undefined, {
      ...collection,
      ...overrides,
    })
  })
}
