import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { SBFormikBag } from '../../lib/storybook/SBFormikBag'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { NewResource, NewResourceProgressState, NewResourceProps } from './NewResource'
import { NewResourceFormValues } from './types'

const meta: ComponentMeta<typeof NewResource> = {
  title: 'Pages/New Resource',
  component: NewResource,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'NewResourceProgressStateStory',
    'NewResourceStoryProps',
    'NewResourceContentUploadedStoryProps',
    'NewResourceImageUploadedStoryProps',
    'NewResourceCollectionsStoryProps',
    'NewResourceExtraDataStoryProps',
  ],
}

const NewResourceStory: ComponentStory<typeof NewResource> = args => <NewResource {...args} />

export const NewResourceProgressStateStory: NewResourceProgressState = [
  ['UploadResource', `Upload Resource`],
  ['Collections', `Add to Collections`],
  ['ExtraData', `Add Details`],
]

const formBag = SBFormikBag<NewResourceFormValues>({
  addToCollections: [],
  category: 'category',
  content: 'content',
  contentType: 'Link',
  description: 'description',
  format: 'format',
  image: 'image',
  language: 'language',
  level: 'level',
  license: 'license',
  name: 'name',
  originalDate: new Date(),
  title: 'title',
  type: 'type',
})

export const NewResourceStoryProps: NewResourceProps = {
  headerPageTemplateProps: {
    headerPageProps: {
      ...HeaderPageLoggedInStoryProps,
      showSubHeader: false,
    },
    isAuthenticated: true,
    showSubHeader: false,
  },
  stepProps: {
    step: 'UploadResourceStep',
    formBag,
    state: 'ChooseResource',
    imageUrl: '',
    nextStep: action('nextStep'),
    deleteContent: action('deleteContent'),
  },
}

export const NewResourceContentUploadedStoryProps: NewResourceProps = {
  ...NewResourceStoryProps,
  stepProps: {
    ...NewResourceStoryProps.stepProps,
    state: 'EditData',
    imageUrl: '',
  },
}

export const NewResourceImageUploadedStoryProps: NewResourceProps = {
  ...NewResourceStoryProps,
  stepProps: {
    ...NewResourceStoryProps.stepProps,
    state: 'EditData',
    imageUrl: 'https://picsum.photos/200/100',
  },
}

// export const NewResourceCollectionsStoryProps: NewResourceProps = {
//   ...NewResourceStoryProps,
//   currentState: 'Collections',
// }

// export const NewResourceExtraDataStoryProps: NewResourceProps = {
//   ...NewResourceStoryProps,
//   currentState: 'ExtraData',
// }

export const Start = NewResourceStory.bind({})
Start.args = NewResourceStoryProps

export const ContentUploaded = NewResourceStory.bind({})
ContentUploaded.args = NewResourceContentUploadedStoryProps

export const ImageUploaded = NewResourceStory.bind({})
ImageUploaded.args = NewResourceImageUploadedStoryProps

// export const Collections = NewResourceStory.bind({})
// Collections.args = NewResourceCollectionsStoryProps

// export const ExtraData = NewResourceStory.bind({})
// ExtraData.args = NewResourceExtraDataStoryProps

export default meta
