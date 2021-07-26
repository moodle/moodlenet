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
    'NewResourceCollectionsStoryProps',
    'NewResourceExtraDataStoryProps'
  ],
}

const NewResourceStory: ComponentStory<typeof NewResource> = args => <NewResource {...args} />

export const NewResourceProgressStateStory: NewResourceProgressState = [
  ['UploadResource', 'Upload Resource'], 
  ['Collections', 'Add to Collections'], 
  ['ExtraData', 'Add Details']
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
  uploadResource: UploadResourceStoryProps,
  states: NewResourceProgressStateStory,
  currentState: 'UploadResource'  
}

export const NewResourceCollectionsStoryProps: NewResourceProps = {
  ...NewResourceStoryProps,
  currentState: 'Collections'
}

export const NewResourceExtraDataStoryProps: NewResourceProps = {
  ...NewResourceStoryProps,
  currentState: 'ExtraData'
}

export const UploadResource = NewResourceStory.bind({})
UploadResource.args = NewResourceStoryProps

export const Collections = NewResourceStory.bind({})
Collections.args = NewResourceCollectionsStoryProps

export const ExtraData = NewResourceStory.bind({})
ExtraData.args = NewResourceExtraDataStoryProps

export default meta
