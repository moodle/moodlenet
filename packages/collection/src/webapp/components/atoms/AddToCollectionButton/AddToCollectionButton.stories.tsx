import type { AddonItem } from '@moodlenet/component-library'
import { action } from '@storybook/addon-actions'
import { useState } from 'react'
import { AddToCollectionButton } from './AddToCollectionButtons.js'
import { CollectionTextOptionProps } from './storiesData.js'

export const useAddToCollectionButtonStory = (): AddonItem => {
  const [selectedCollections, setSelectedCollections] = useState<string[]>(['Algebra', 'Sociology'])
  const collections = {
    opts: CollectionTextOptionProps,
    selected: CollectionTextOptionProps.filter(
      ({ value }) => !!selectedCollections.includes(value),
    ),
  }
  const setCollection = (collections: string[]) => {
    action('setCollections')(collections)
    setSelectedCollections(collections)
  }
  return {
    Item: () => (
      <AddToCollectionButton
        collections={collections}
        selectedCollections={selectedCollections}
        setCollections={e => setCollection(e)}
      />
    ),
    key: 'add-to-collection-button',
  }
}
