import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { SBFormikBag } from '../../lib/storybook/SBFormikBag'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import {
  CategoriesDropdown,
  LanguagesDropdown,
  LevelDropdown,
  LicenseDropdown,
  MonthDropdown,
  TypeDropdown,
  YearsDropdown
} from './FieldsData'
import { NewResource, NewResourceProgressState, NewResourceProps } from './NewResource'
import { NewResourceFormValues } from './types'
import { UploadResourceProps } from './UploadResource/UploadResource'

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
    'NewResourceExtraDetailsStoryProps',
  ],
}

const NewResourceStory: ComponentStory<typeof NewResource> = args => <NewResource {...args} />

export const NewResourceProgressStateStory: NewResourceProgressState = [
  ['UploadResource', `Upload resource`],
  ['AddToCollections', `Add to collections`],
  ['ExtraDetails', `Add details`],
]

const initialFormValues: NewResourceFormValues = {
  collections: [],
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
  originalDateMonth: '',
  originalDateYear: '',
  title: '',
  type: '',
}

const basicDataFormValue: NewResourceFormValues = {
  ...initialFormValues,
  title: 'The Best Content Ever',
  description:
    'This is the description that tells you that this a not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
  category: 'Important Matters',
}

const advancedDataFormValue: NewResourceFormValues = {
  ...initialFormValues,
  license: 'CC-BY-NC (Attribution-NonCommercial)',
  category: '0021 Literacy and numeracy'
}

const formBag = SBFormikBag<NewResourceFormValues>(initialFormValues)
const formBagBasic = SBFormikBag<NewResourceFormValues>(basicDataFormValue)
const formBagAdvanced = SBFormikBag<NewResourceFormValues>(advancedDataFormValue)

const uploadResourceProps: UploadResourceProps = {
  step: 'UploadResourceStep',
  formBag,
  state: 'ChooseResource',
  imageUrl: '',
  nextStep: undefined,
  deleteContent: action('deleteContent'),
  categories: CategoriesDropdown,
  licenses: LicenseDropdown,
}
export const NewResourceStoryProps: NewResourceProps = {
  headerPageTemplateProps: {
    headerPageProps: {
      ...HeaderPageLoggedInStoryProps,
      showSubHeader: false,
    },
    isAuthenticated: true,
    showSubHeader: false,
  },
  stepProps: uploadResourceProps,
}

export const NewResourceContentUploadedStoryProps: NewResourceProps = {
  ...NewResourceStoryProps,
  stepProps: {
    ...uploadResourceProps,
    state: 'EditData',
    formBag: formBagBasic,
  },
}

export const NewResourceImageUploadedStoryProps: NewResourceProps = {
  ...NewResourceContentUploadedStoryProps,
  stepProps: {
    ...uploadResourceProps,
    state: 'EditData',
    imageUrl: 'https://picsum.photos/200/100',
    formBag: formBagAdvanced,
  },
}

export const NewResourceAddToCollectionsStoryProps: NewResourceProps = {
  ...NewResourceContentUploadedStoryProps,
  stepProps: {
    ...NewResourceContentUploadedStoryProps.stepProps,
    step: 'AddToCollectionsStep',
    collections: [
      'Education',
      'Biology',
      'Algebra',
      'Phycology',
      'Phylosophy',
      'Sociology',
      'English Literature',
      'Marketing',
      'Physiotherapy',
      'Agriculture',
      'Taxonomy',
      'Law',
      'Interpretation',
      'Molecular Biology',
      'Nano Engineering',
      'Macro Economy',
      'Animal Rights',
    ].map(label => ({ label, id: label })),
    setAddToCollections: action('setAddToCollections'),
    previousStep: action('previousStep'),
    setSearchText: action('setSearchText'),
    selectedCollections: [],
  },
}

export const NewResourceExtraDetailsStoryProps: NewResourceProps = {
  ...NewResourceContentUploadedStoryProps,
  stepProps: {
    step: 'ExtraDetailsStep',
    formBag,
    nextStep: action('nextStep'),
    previousStep: action('previousStep'),
    types: TypeDropdown,
    levels: LevelDropdown,
    months: MonthDropdown,
    years: YearsDropdown,
    languages: LanguagesDropdown,
    // formats: FormatDropdown,
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
