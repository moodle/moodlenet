import {
  CollectionAccess,
  CollectionActions,
  CollectionFormValues,
  CollectionType,
} from '@moodlenet/collection/common'
import { action } from '@storybook/addon-actions'
import { ComponentMeta } from '@storybook/react'
// import { useEffect } from 'react'
import { addMethod, AnySchema, boolean, mixed, MixedSchema, object, SchemaOf, string } from 'yup'
// import { href } from '../../../elements/link'
// import { TagListStory } from '../../../elements/tags'
// import { HeaderLoggedOutStoryProps } from '../../organisms/Header/Header.stories'
// import { HeaderPageTemplateProps } from '../../templates/HeaderPageTemplate'
// import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
// import { CollectionTextOptionProps } from '../NewCollection/AddToCollections/storiesData'
import { OptionItemProp } from '@moodlenet/component-library'
// import {
//   CategoriesTextOptionProps,
//   LicenseIconTextOptionProps,
//   VisbilityIconTextOptionProps,
// } from '../NewCollection/UploadCollection/storiesData'
import { CollectionContributorCardStories } from '@moodlenet/collection/stories'
// import { Collection, CollectionProps } from '@moodlenet/collection/ui'
// import { useFormik } from 'formik'
import { Collection, CollectionProps, MainCollectionCardSlots } from '@moodlenet/collection/ui'
import { overrideDeep } from '@moodlenet/component-library/common'
import { getResourcesCardStoryProps } from '@moodlenet/resource/ui'
import { useFormik } from 'formik'
import { PartialDeep } from 'type-fest'
import {
  MainLayoutLoggedInStoryProps,
  MainLayoutLoggedOutStoryProps,
} from '../../layout/MainLayout/MainLayout.stories.js'

const maxUploadSize = 1024 * 1024 * 50

const meta: ComponentMeta<typeof Collection> = {
  title: 'Pages/Collection',
  component: Collection,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'collectionFormValues',
    'CollectionStoryProps',
    'collectionFormBag',
    'CollectionStoryProps',
    'CollectionLinkLoggedOutStoryProps',
    'CollectionFileLoggedOutStoryProps',
    'CollectionLoggedInStoryProps',
    'CollectionOwnerStoryProps',
    'CollectionAdminStoryProps',
    'validationSchema',
  ],
}

addMethod(MixedSchema, 'oneOfSchemas', function (schemas: AnySchema[]) {
  return this.test(
    'one-of-schemas',
    'Not all items in ${path} match one of the allowed schemas',
    item => schemas.some(schema => schema.isValidSync(item, { strict: true })),
  )
})

export const validationSchema: SchemaOf<CollectionFormValues> = object({
  category: string().required(/* t */ `Please select a subject`),
  content: string().required(/* t */ `Please upload a content`),

  license: string().when('isFile', (isFile, schema) => {
    return isFile ? schema.required(/* t */ `Select a license`) : schema.optional()
  }),
  isFile: boolean().required(),
  description: string().max(4096).min(3).required(/* t */ `Please provide a description`),
  name: string().max(160).min(3).required(/* t */ `Please provide a title`),
  image: mixed()
    .test((v, { createError }) =>
      v instanceof Blob && v.size > maxUploadSize
        ? createError({
            message: /* t */ `The file is too big, reduce the size or provide a url`,
          })
        : true,
    )
    .optional(),
  language: string().optional(),
  level: string().optional(),
  month: string().optional(),
  type: string().optional(),
  visibility: mixed().required(/* t */ `Visibility is required`),
  year: string().when('month', (month, schema) => {
    return month ? schema.required(/* t */ `Please select a year`) : schema.optional()
  }),
})

export const collectionFormValues: CollectionFormValues = {
  description:
    'Earth 2020: An Insider’s Guide to a Rapidly Changing Planet responds to a public increasingly concerned about the deterioration of Earth’s natural systems, offering readers a wealth of perspectives on our shared ecological past, and on the future trajectory of planet Earth. Written by world-leading thinkers on the front-lines of global change research and policy, this multi-disciplinary collection maintains a dual focus: some essays investigate specific facets of the physical Earth system, while others explore the social, legal and political dimensions shaping the human environmental footprint. In doing so, the essays collectively highlight the urgent need for collaboration across diverse domains of expertise in addressing one of the most significant challenges facing us today. Earth 2020 is essential reading for everyone seeking a deeper understanding of the past, present and future of our planet, and the role of humanity in shaping this trajectory.',
  image: 'https://picsum.photos/200/100',
  name: '',
}

export const useCollectionForm = (overrides?: Partial<CollectionFormValues>) => {
  return useFormik<CollectionFormValues>({
    validationSchema,
    onSubmit: action('submit edit'),
    initialValues: {
      name: 'Best collection ever',
      description:
        'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
      image:
        'https://images.unsplash.com/photo-1543964198-d54e4f0e44e3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
      ...overrides,
    },
  })
}

export const CollectionTextOptionProps: OptionItemProp[] = [
  { label: 'Education', value: 'Education' },
  { label: 'Biology', value: 'Biology' },
  { label: 'Algebra', value: 'Algebra' },
  { label: 'Phycology', value: 'Phycology' },
  { label: 'Phylosophy', value: 'Phylosophy' },
  { label: 'Sociology', value: 'Sociology' },
  { label: 'English Literature', value: 'English Literature' },
]

export const useCollectionStoryProps = (
  overrides?: PartialDeep<CollectionProps>,
): CollectionProps => {
  const collection: CollectionType = {
    id: 'qjnwglkd69io-sports',
    mnUrl: 'collection.url',
    numFollowers: 23,
    ...overrides?.collection,
  }

  const collectionForm: CollectionFormValues = {
    name: 'Best collection ever',
    description:
      'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find.',
    image:
      'https://images.unsplash.com/photo-1543964198-d54e4f0e44e3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    // ...overrides?.collectionForm,
  }

  const actions: CollectionActions = {
    followed: false,
    toggleFollow: action('toggleFollow'),
    isPublished: true,
    bookmarked: false,
    toggleBookmark: action('toggleBookmark'),
    editCollection: async () => action('editing collection submited'),
    setIsPublished: action('setIsPublished'),
    deleteCollection: action('deleteCollection'),
    ...overrides?.actions,
  }

  const access: CollectionAccess = {
    isAuthenticated: true,
    canEdit: false,
    isCreator: false,
    isAdmin: false,
    ...overrides?.access,
  }

  const mainCollectionCardSlots: MainCollectionCardSlots = {
    mainColumnItems: [],
    headerColumnItems: [],
    topLeftHeaderItems: [],
    topRightHeaderItems: [],
    moreButtonItems: [],
    footerRowItems: [],
  }

  const resourceCardPropsList = getResourcesCardStoryProps(15, {
    orientation: 'horizontal',
  })

  return overrideDeep<CollectionProps>(
    {
      mainLayoutProps:
        overrides?.access?.isAuthenticated !== undefined && !overrides?.access?.isAuthenticated
          ? MainLayoutLoggedOutStoryProps
          : MainLayoutLoggedInStoryProps,

      mainCollectionCardSlots: mainCollectionCardSlots,
      collectionContributorCardProps:
        CollectionContributorCardStories.CollectionContributorCardStoryProps,
      resourceCardPropsList: resourceCardPropsList,

      collection: collection,
      collectionForm: collectionForm,
      validationSchema: validationSchema,

      actions: actions,
      access: access,
    },
    { ...overrides },
  )
}

// const headerPageTemplatePropsUnauth: HeaderPageTemplateProps = {
//   isAuthenticated: false,
//   headerPageProps: {
//     headerProps: {
//       ...HeaderLoggedOutStoryProps,
//       me: null,
//     },
//   },
//   mainPageWrapperProps: {
//     userAcceptsPolicies: null,
//     cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
//   },
// }
// export const LinkLoggedOut = () => {
//   const props = CollectionStoryProps({
//     props: {
//       headerPageTemplateProps: headerPageTemplatePropsUnauth,
//       isAuthenticated: false,
//     },
//   })

//   return <Collection {...props} />
// }

// export const FileLoggedOut = () => {
//   const props = CollectionStoryProps({
//     props: {
//       headerPageTemplateProps: headerPageTemplatePropsUnauth,
//       isAuthenticated: false,
//       contentType: 'file',
//       contentUrl: 'https://picsum.photos/200/100',
//       collectionFormat: 'Video',
//     },
//   })
//   return <Collection {...props} />
// }

export default meta
