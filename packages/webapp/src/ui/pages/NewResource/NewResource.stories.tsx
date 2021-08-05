import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { SBFormikBag } from '../../lib/storybook/SBFormikBag'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { CategoryDropdown } from './FieldsData'
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
    'NewResourceAddToCollectionsStoryProps',
    'NewResourceExtraDetailsStoryProps'
  ],
}

const NewResourceStory: ComponentStory<typeof NewResource> = args => <NewResource {...args} />

export const NewResourceProgressStateStory: NewResourceProgressState = [
  ['UploadResource', `Upload Resource`],
  ['AddToCollections', `Add to Collections`],
  ['ExtraDetails', `Add Details`],
]

const initialFormValues: NewResourceFormValues = {
  addToCollections: [],
  category: '',
  content: 'content',
  contentType: 'File',
  description: '',
  format: '',
  image: 'image',
  language: '',
  level: '',
  license: '',
  name: 'https://moodle.com/awesome-content',
  originalDate: new Date(),
  title: '',
  type: '',
}

const basicDataFormValue: NewResourceFormValues = {
  ...initialFormValues, 
  title: 'The Best Content Ever', 
  description: 'This is the description that tells you that this a not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.', 
  category: 'Important Matters'
}

const formBag = SBFormikBag<NewResourceFormValues>(initialFormValues)
const formBagBasicData = SBFormikBag<NewResourceFormValues>(basicDataFormValue)

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
    categories: CategoryDropdown
  },
}

export const NewResourceContentUploadedStoryProps: NewResourceProps = {
  ...NewResourceStoryProps,
  stepProps: {
    ...NewResourceStoryProps.stepProps,
    step: 'UploadResourceStep',
    state: 'EditData',
    imageUrl: '',
    formBag: formBagBasicData,
  },
}

export const NewResourceImageUploadedStoryProps: NewResourceProps = {
  ...NewResourceContentUploadedStoryProps,
  stepProps: {
    ...NewResourceContentUploadedStoryProps.stepProps,
    state: 'EditData',
    imageUrl: 'https://picsum.photos/200/100',
  },
}

export const NewResourceAddToCollectionsStoryProps: NewResourceProps = {
   ...NewResourceContentUploadedStoryProps,
   stepProps: {
     ...NewResourceContentUploadedStoryProps.stepProps,
     step: 'AddToCollectionsStep',
     collections: ['Education', 'Biology', 'Algebra', 'Phycology', 'Phylosophy', 'Sociology', 'English Literature', 'Marketing', 'Physiotherapy', 'Agriculture', 'Taxonomy', 'Law', 'Interpretation', 'Molecular Biology', 'Nano Engineering', 'Macro Economy', 'Animal Rights'],
     previousStep: action('previousStep'),
     setSearchText: action('setSearchText')
   }
}

 export const NewResourceExtraDetailsStoryProps: NewResourceProps = {
   ...NewResourceContentUploadedStoryProps,
   stepProps: {
    step: 'ExtraDetailsStep',
    formBag,
    nextStep: action('nextStep'),
    previousStep: action('previousStep')
  },
 }

export const Start = NewResourceStory.bind({})
Start.args = NewResourceStoryProps

export const ContentUploaded = NewResourceStory.bind({})
ContentUploaded.args = NewResourceContentUploadedStoryProps

export const ImageUploaded = NewResourceStory.bind({})
ImageUploaded.args = NewResourceImageUploadedStoryProps

export const AddToCollections = NewResourceStory.bind({})
AddToCollections.args = NewResourceAddToCollectionsStoryProps

export const ExtraDetails = NewResourceStory.bind({})
ExtraDetails.args = NewResourceExtraDetailsStoryProps

export default meta
