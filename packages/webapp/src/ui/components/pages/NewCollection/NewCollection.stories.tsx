import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import { SBFormikBag } from '../../../lib/storybook/SBFormikBag'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { VisibilityDropdown } from '../NewResource/FieldsData'
import { CreateCollectionProps } from './CreateCollection/CreateCollection'
import { NewCollection, NewCollectionProgressState, NewCollectionProps } from './NewCollection'
import { NewCollectionFormValues } from './types'

const meta: ComponentMeta<typeof NewCollection> = {
  title: 'Pages/New Collection',
  component: NewCollection,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'NewCollectionProgressStateStory',
    'NewCollectionStoryProps',
    'NewCollectionContentUploadedStoryProps',
    'NewCollectionImageUploadedStoryProps',
    'NewCollectionCollectionsStoryProps',
    'NewCollectionExtraDataStoryProps',
    'NewCollectionAddToCollectionsStoryProps',
    'NewCollectionExtraDetailsStoryProps',
  ],
}

const NewCollectionStory: ComponentStory<typeof NewCollection> = args => <NewCollection {...args} />

export const NewCollectionProgressStateStory: NewCollectionProgressState = [
  ['CreateCollection', `Create Collection`],
  //['AddResources', `Add Resources to Collection`],
]

const initialFormValues: NewCollectionFormValues = {
  description: '',
  image: 'image',
  imageUrl: 'image',
  title: '',
  visibility: 'Private',
}

const basicDataFormValue: NewCollectionFormValues = {
  ...initialFormValues,
  title: 'The best collection ever',
  description:
    'This is the description that tells you that this a not only the best collection ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
}

const formBag = SBFormikBag<NewCollectionFormValues>(initialFormValues)
const formBagBasicData = SBFormikBag<NewCollectionFormValues>(basicDataFormValue)

const CreateCollectionStoryProps: CreateCollectionProps = {
  step: 'CreateCollectionStep',
  formBag,
  imageUrl: '',
  visibility: VisibilityDropdown,
  finish: action('nextStep'),
}

export const NewCollectionStoryProps: NewCollectionProps = {
  headerPageTemplateProps: {
    headerPageProps: {
      ...HeaderPageLoggedInStoryProps,
      showSubHeader: false,
    },
    isAuthenticated: true,
    showSubHeader: false,
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
  },
  stepProps: CreateCollectionStoryProps,
}

export const NewCollectionImageUploadedStoryProps: NewCollectionProps = {
  ...NewCollectionStoryProps,
  stepProps: {
    ...CreateCollectionStoryProps,
    imageUrl: 'https://picsum.photos/200/100',
    formBag: formBagBasicData,
  },
}

/*export const NewCollectionAddResourcesStoryProps: NewCollectionProps = {
  ...NewCollectionContentUploadedStoryProps,
  stepProps: {
    ...NewCollectionContentUploadedStoryProps.stepProps,
    step: 'AddToCollectionsStep'
  },
}*/

export const Start = NewCollectionStory.bind({})
Start.args = NewCollectionStoryProps

export const ImageUploaded = NewCollectionStory.bind({})
ImageUploaded.args = NewCollectionImageUploadedStoryProps

//export const AddResources = NewCollectionStory.bind({})
//AddResources.args = NewCollectionAddResourcesStoryProps

export default meta
