import { getRandomSortedArrayElements } from '@moodlenet/component-library'
import { resourcesCardFactory } from '../../../helpers/factories.js'
import { ResourceCardProps } from './ResourceCard.js'
import { getResourceCardStoryProps } from './ResourceCard.stories.js'

export const getResourcesCardStoryProps = (
  amount = 8,
  overrides?: Partial<ResourceCardProps>,
): ResourceCardProps[] => {
  return getRandomSortedArrayElements(resourcesCardFactory, amount).map(resource => {
    return getResourceCardStoryProps(undefined, {
      ...resource,
      ...overrides,
    })
  })
}
