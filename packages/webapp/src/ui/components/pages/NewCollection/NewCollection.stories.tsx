import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { useCreateCollectionStoryProps } from './CreateCollection/CreateCollection.stories'
import {
  NewCollection,
  NewCollectionProgressState,
  NewCollectionProps,
} from './NewCollection'

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
    'useNewCollectionStoryProps',
  ],
}

export const NewCollectionProgressStateStory: NewCollectionProgressState = [
  ['CreateCollection', `Create Collection`],
  //['AddResources', `Add Resources to Collection`],
]

type NewCollectionPropsNoStep = Omit<NewCollectionProps, 'stepProps'>
export const useNewCollectionStoryProps = (overrides?: {
  props?: Partial<NewCollectionPropsNoStep>
}): NewCollectionPropsNoStep => {
  return {
    headerPageTemplateProps: {
      headerPageProps: {
        ...HeaderPageLoggedInStoryProps,
        // showSubHeader: false,
      },
      isAuthenticated: true,
      showSubHeader: false,
      mainPageWrapperProps: {
        userAcceptsPolicies: null,
        cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
      },
    },
    ...overrides?.props,
  }
}

type NewCollectionStory = ComponentStory<typeof NewCollection>
export const Start: NewCollectionStory = () => {
  const props: NewCollectionProps = {
    ...useNewCollectionStoryProps(),
    stepProps: useCreateCollectionStoryProps(),
  }
  return <NewCollection {...props} />
}
export const ImageUploaded: NewCollectionStory = () => {
  const props: NewCollectionProps = {
    ...useNewCollectionStoryProps(),
    stepProps: useCreateCollectionStoryProps({
      formValues: {
        image: { location: 'https://picsum.photos/200/100' },
        title: 'The best collection ever',
        description:
          'This is the description that tells you that this a not only the best collection ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
      },
    }),
  }
  return <NewCollection {...props} />
}

export default meta
