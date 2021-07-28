import { t } from '@lingui/macro'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { NewResource, NewResourceProgressState, NewResourceProps } from './NewResource'
import { UploadResourceStoryProps } from './UploadResource/UploadResource.stories'

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
    'NewResourceExtraDataStoryProps'
  ],
}

const NewResourceStory: ComponentStory<typeof NewResource> = args => <NewResource {...args} />

export const NewResourceProgressStateStory: NewResourceProgressState = [
  ['UploadResource', t`Upload Resource`], 
  ['Collections', t`Add to Collections`], 
  ['ExtraData', t`Add Details`]
];

export const NewResourceStoryProps: NewResourceProps = {
  headerPageTemplateProps: {
    headerPageProps: {
      ...HeaderPageLoggedInStoryProps,
      showSubHeader: false
    },
    isAuthenticated: true,
    showSubHeader: false
  },
  uploadResource: {
    ...UploadResourceStoryProps,
    state: 'Initial'
  },
  states: NewResourceProgressStateStory,
  currentState: 'UploadResource'  
}

export const NewResourceContentUploadedStoryProps: NewResourceProps = {
  ...NewResourceStoryProps,
  uploadResource: {
    ...UploadResourceStoryProps,
    state: 'ContentUploaded'
  }
}

export const NewResourceImageUploadedStoryProps: NewResourceProps = {
  ...NewResourceStoryProps,
  uploadResource: {
    ...UploadResourceStoryProps,
    state: 'ImageUploaded'
  }
}

export const NewResourceCollectionsStoryProps: NewResourceProps = {
  ...NewResourceStoryProps,
  currentState: 'Collections'
}

export const NewResourceExtraDataStoryProps: NewResourceProps = {
  ...NewResourceStoryProps,
  currentState: 'ExtraData'
}

export const Start = NewResourceStory.bind({})
Start.args = NewResourceStoryProps

export const ContentUploaded = NewResourceStory.bind({})
ContentUploaded.args = NewResourceContentUploadedStoryProps

export const ImageUploaded = NewResourceStory.bind({})
ImageUploaded.args = NewResourceImageUploadedStoryProps

export const Collections = NewResourceStory.bind({})
Collections.args = NewResourceCollectionsStoryProps

export const ExtraData = NewResourceStory.bind({})
ExtraData.args = NewResourceExtraDataStoryProps

export default meta
