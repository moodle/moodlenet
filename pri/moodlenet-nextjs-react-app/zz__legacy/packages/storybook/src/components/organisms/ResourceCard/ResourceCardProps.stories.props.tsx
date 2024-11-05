import { getRandomSortedArrayElements } from '@moodlenet/component-library'
import type { ResourceCardProps } from '@moodlenet/ed-resource/ui'
import { resourcesCardFactory } from '@moodlenet/ed-resource/ui'
import { transformPropsToObjectWithKey } from '@moodlenet/react-app/ui'
import type { PartialDeep } from 'type-fest'
import { getResourceCardStoryProps } from './ResourceCard.stories'

export const getResourceCardsStoryProps = (
  amount = 8,
  overrides?: PartialDeep<ResourceCardProps>,
  showAlert?: boolean,
): { props: ResourceCardProps; key: string }[] => {
  const randomsortedarray = getRandomSortedArrayElements(resourcesCardFactory, amount)
  return randomsortedarray.map((resource, i) => {
    const newResource = getResourceCardStoryProps({
      ...resource,
      ...overrides,
      showVisualAlert: i < 2 && showAlert,
    })
    return transformPropsToObjectWithKey(newResource, resource.data?.id ?? '')
  })
}
