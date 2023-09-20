import { action } from '@storybook/addon-actions'
import type { Meta as ComponentMeta } from '@storybook/react'
// import { useEffect } from 'react'
import type { SchemaOf } from 'yup'
import { boolean, mixed, object, string } from 'yup'
// import { href } from '../../../elements/link'
// import { TagListStory } from '../../../elements/tags'
// import { HeaderLoggedOutStoryProps } from '../../organisms/Header/Header.stories'
// import { HeaderPageTemplateProps } from '../../templates/HeaderPageTemplate'
// import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
// import { CollectionTextOptionProps } from '../NewCollection/AddToCollections/storiesData'
import type { OptionItemProp } from '@moodlenet/component-library'
// import {
// import { Collection, CollectionProps } from '@moodlenet/collection/ui'
// import { useFormik } from 'formik'
import type { CollectionFormProps } from '@moodlenet/collection/common'
import type { MainCollectionCardProps } from '@moodlenet/collection/ui'
import { Collection, MainCollectionCard } from '@moodlenet/collection/ui'
import { DropdownFieldsDataStories } from '@moodlenet/component-library/stories'
import { useCollectionForm } from '../../../components/pages/Collection/CollectionProps.stories'
const maxUploadSize = 1024 * 1024 * 50

const meta: ComponentMeta<typeof Collection> = {
  title: 'Molecules/MainCollectionCard',
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
    'CollectionTextOptionProps',
    'useMainCollectionCardStoryProps',
    'LoggedIn',
    'Owner',
    'Admin',
  ],
}

export const validationSchema: SchemaOf<CollectionFormProps> = object({
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
export const collectionFormValues: CollectionFormProps = {
  isFile: true,
  // visibility: VisbilityIconTextOptionProps[0]!.value,
  // category: CategoriesTextOptionProps[2]!.value,
  content: '',
  // description:
  //   'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
  description:
    'Earth 2020: An Insider’s Guide to a Rapidly Changing Planet responds to a public increasingly concerned about the deterioration of Earth’s natural systems, offering readers a wealth of perspectives on our shared ecological past, and on the future trajectory of planet Earth. Written by world-leading thinkers on the front-lines of global change research and policy, this multi-disciplinary collection maintains a dual focus: some essays investigate specific facets of the physical Earth system, while others explore the social, legal and political dimensions shaping the human environmental footprint. In doing so, the essays collectively highlight the urgent need for collaboration across diverse domains of expertise in addressing one of the most significant challenges facing us today. Earth 2020 is essential reading for everyone seeking a deeper understanding of the past, present and future of our planet, and the role of humanity in shaping this trajectory.',
  image: { location: 'https://picsum.photos/200/100' },
  // language: LanguagesTextOptionProps[2]!.value,
  // level: LevelTextOptionProps[2]!.value,
  // license: LicenseIconTextOptionProps[2]!.value,
  // month: MonthTextOptionProps[8]!.value,
  // year: YearsProps[20],
  name: '',
  // name: 'The Best Collection Ever',
  type: DropdownFieldsDataStories.TypeTextOptionProps[2]!.value,
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

export const useMainCollectionCardStoryProps = (overrides?: {
  props?: Partial<MainCollectionCardProps>
  // formConfig?: Partial<FormikConfig<CollectionFormProps>>
  collectionValues?: Partial<CollectionFormProps>
}): MainCollectionCardProps => {
  const collection: CollectionFormProps = {
    // validationSchema,
    // onSubmit: action('submit edit'),
    // initialValues: {
    content: null,
    isFile: true,
    // visibility: 'Public',
    name: 'Best collection ever',
    description:
      'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us. This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
    // 'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
    // category: CategoriesTextOptionProps[2]!.value,
    // language: LanguagesTextOptionProps[2]?.value,
    // level: LevelTextOptionProps[2]?.value,
    // license: LicenseIconTextOptionProps[2]?.value,
    // month: MonthTextOptionProps[8]?.value,
    // year: YearsProps[20],
    type: DropdownFieldsDataStories.TypeTextOptionProps[2]?.value,
    image: {
      location:
        'https://images.unsplash.com/photo-1543964198-d54e4f0e44e3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    },
    ...overrides?.collectionValues,
    // },
    // ...overrides?.formConfig,
  }

  return {
    collection: collection,
    publish: action('save collection'),
    editCollection: async () => action('editing collection submited'),

    id: 'qjnwglkd69io-sports',
    url: 'collection.url',
    fileMaxSize: 5 * 1024 * 1024,

    isAuthenticated: true,
    canEdit: false,
    isCreator: false,
    isAdmin: false,
    shouldShowErrors: false,
    isPublished: false,
    setIsPublished: action('set is published'),
    form: useCollectionForm(),
    followed: false,
    numFollowers: 23,
    bookmarked: false,
    // tags: TagListStory.slice(0, 1),
    collectionUrl: '#',
    // reportForm: useFormik<{ comment: string }>({
    //   initialValues: { comment: '' },
    //   onSubmit: action('submit report Form'),
    // }),
    toggleFollow: action('toggleLike'),
    toggleBookmark: action('toggleBookmark'),
    deleteCollection: action('deleteCollection'),

    autoImageAdded: false,
    canSearchImage: true,
    ...overrides?.props,
    ...overrides?.collectionValues,
  }
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

export const LoggedIn = () => {
  const props = useMainCollectionCardStoryProps({})
  return <MainCollectionCard {...props} />
}

export const Owner = () => {
  const props = useMainCollectionCardStoryProps({
    props: {
      isCreator: true,
      collectionUrl: 'https://picsum.photos/200/100',
    },
  })
  return <MainCollectionCard {...props} />
}

export const Admin = () => {
  const props = useMainCollectionCardStoryProps({
    props: {
      isCreator: true,
      isAdmin: true,
    },
  })
  return <MainCollectionCard {...props} />
}

export default meta
