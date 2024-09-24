import type { AddonItem } from '@moodlenet/component-library'
import { action } from '@storybook/addon-actions'
import { useState } from 'react'
import { AddToCollectionButton } from './AddToCollectionButtons'
import { CollectionTextOptionProps } from './storiesData.mjs'

export const useAddToCollectionButtonStory = (): AddonItem => {
  const [selectedCollections, setSelectedCollections] = useState<string[]>(['Algebra', 'Sociology'])
  const collections = {
    opts: CollectionTextOptionProps,
    selected: CollectionTextOptionProps.filter(
      ({ value }) => !!selectedCollections.includes(value),
    ),
  }
  return {
    Item: () => (
      <AddToCollectionButton
        collections={collections}
        add={collection => {
          action(`add to collection`)(collection)
          setSelectedCollections(collections => [...collections, collection])
        }}
        remove={collection => {
          action(`remove from collection`)(collection)
          setSelectedCollections(collections => collections.filter(c => c !== collection))
        }}
      />
    ),
    key: 'add-to-collection-button',
  }
}
