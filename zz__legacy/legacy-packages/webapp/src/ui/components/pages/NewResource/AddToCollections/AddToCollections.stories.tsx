import { ComponentMeta } from '@storybook/react'
import { AddToCollections, AddToCollectionsProps } from './AddToCollections'
import { CollectionTextOptionProps } from './storiesData'

const meta: ComponentMeta<typeof AddToCollections> = {
  title: 'Pages/New Resource/Add To Collections',
  component: AddToCollections,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['AddToCollectionsStoryProps'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 1100 }}>
        <Story />
      </div>
    ),
  ],
}

export const AddToCollectionsStoryProps: AddToCollectionsProps = {
  collections: {
    opts: CollectionTextOptionProps,
    selected: CollectionTextOptionProps.slice(3, 5),
  },
}

export default meta
