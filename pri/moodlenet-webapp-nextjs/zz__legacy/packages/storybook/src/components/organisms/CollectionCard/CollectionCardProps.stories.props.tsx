import type { CollectionCardProps } from '@moodlenet/collection/ui'
import { collectionsCardFactory } from '@moodlenet/collection/ui'
import { getRandomSortedArrayElements } from '@moodlenet/component-library'
import { transformPropsToObjectWithKey } from '@moodlenet/react-app/ui'
import type { PartialDeep } from 'type-fest'
import { getCollectionCardStoryProps } from './CollectionCard.stories'

export const getCollectionCardsStoryProps = (
  amount = 8,
  overrides?: PartialDeep<CollectionCardProps>,
): { props: CollectionCardProps; key: string }[] => {
  return getRandomSortedArrayElements(collectionsCardFactory, amount).map(collection => {
    // return getCollectionCardStoryProps({ ...collection, ...overrides })

    //@ts-ignore because it needs to be reviewed
    // @BRU, prop type definition doesn't match
    const newCollection = getCollectionCardStoryProps({
      ...collection,
      ...overrides,
    })
    return transformPropsToObjectWithKey(newCollection, collection.data?.id ?? '')
  })
}
