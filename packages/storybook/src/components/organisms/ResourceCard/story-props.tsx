import { getRandomSortedArrayElements } from '@moodlenet/component-library'
import type { ResourceCardProps } from '@moodlenet/ed-resource/ui'
import { resourcesCardFactory } from '@moodlenet/ed-resource/ui'
import type { PartialDeep } from 'type-fest'
import { getResourceCardStoryProps } from './ResourceCard.stories.js'

export const getResourcesCardStoryProps = (
  amount = 8,
  overrides?: PartialDeep<ResourceCardProps>,
): ResourceCardProps[] => {
  const randomsortedarray = getRandomSortedArrayElements(resourcesCardFactory, amount)
  return randomsortedarray.map(resource => {
    return getResourceCardStoryProps({
      ...resource,
      ...overrides,
    })
  })
}
