import { CollectionFormValues } from '@moodlenet/collection/common'
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
import { OptionItemProp, TypeTextOptionProps } from '@moodlenet/component-library'
// import {
//   CategoriesTextOptionProps,
//   LicenseIconTextOptionProps,
//   VisbilityIconTextOptionProps,
// } from '../NewCollection/UploadCollection/storiesData'
import { CollectionContributorCardStories } from '@moodlenet/collection/stories'
// import { Collection, CollectionProps } from '@moodlenet/collection/ui'
// import { useFormik } from 'formik'
import { Collection, CollectionProps } from '@moodlenet/collection/ui'
import { useMainCollectionCardStoryProps } from 'components/organisms/MainCollectionCard/stories-props.js'
import { useFormik } from 'formik'
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
  isFile: false,
  content: '',
  // visibility: VisbilityIconTextOptionProps[0]!.value,
  // category: CategoriesTextOptionProps[2]!.value,
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
  type: TypeTextOptionProps[2]!.value,
}

export const useCollectionForm = (overrides?: Partial<CollectionFormValues>) => {
  return useFormik<CollectionFormValues>({
    validationSchema,
    onSubmit: action('submit edit'),
    initialValues: {
      isFile: true,
      content: '',
      name: 'Best collection ever',
      description:
        'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
      type: TypeTextOptionProps[2]!.value,
      image: {
        location:
          'https://images.unsplash.com/photo-1543964198-d54e4f0e44e3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
      },
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

export const useCollectionStoryProps = (overrides?: {
  props?: Partial<CollectionProps>
  // formConfig?: Partial<FormikConfig<CollectionFormValues>>
  collectionValues?: Partial<CollectionFormValues>
}): CollectionProps => {
  const collection: CollectionFormValues = {
    // validationSchema,
    // onSubmit: action('submit edit'),
    // initialValues: {
    isFile: false,
    content: 'moodle.net',
    // visibility: 'Public',
    name: 'Best collection ever',
    description:
      'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
    // 'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
    // category: CategoriesTextOptionProps[2]!.value,
    // language: LanguagesTextOptionProps[2]?.value,
    // level: LevelTextOptionProps[2]?.value,
    // license: LicenseIconTextOptionProps[2]?.value,
    // month: MonthTextOptionProps[8]?.value,
    // year: YearsProps[20],
    type: TypeTextOptionProps[2]?.value,
    image: {
      location:
        'https://images.unsplash.com/photo-1543964198-d54e4f0e44e3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    },
    ...overrides?.collectionValues,
    // },
    // ...overrides?.formConfig,
  }

  return {
    mainLayoutProps:
      overrides?.props?.isAuthenticated !== undefined && !overrides?.props?.isAuthenticated
        ? MainLayoutLoggedOutStoryProps
        : MainLayoutLoggedInStoryProps,
    mainCollectionCardProps: useMainCollectionCardStoryProps({}),

    collection: collection,
    editCollection: async () => action('editing collection submited'),
    validationSchema: validationSchema,

    id: 'qjnwglkd69io-sports',
    url: 'collection.url',
    setIsPublished: action('setIsPublished'),

    isAuthenticated: true,
    canEdit: false,
    isOwner: false,
    isAdmin: false,
    numFollowers: 23,
    // bookmarked: true,
    collectionContributorCardProps:
      CollectionContributorCardStories.CollectionContributorCardStoryProps,
    collectionUrl: '#',

    // reportForm: useFormik<{ comment: string }>({
    //   initialValues: { comment: '' },
    //   onSubmit: action('submit report Form'),
    // }),

    // types: {
    //   opts: TypeTextOptionProps,
    //   selected: TypeTextOptionProps.find(({ value }) => value === collection.type),
    // },
    // levels: {
    //   opts: LevelTextOptionProps,
    //   selected: LevelTextOptionProps.find(({ value }) => value === collection.level),
    // },
    // languages: {
    //   opts: LanguagesTextOptionProps,
    //   selected: LanguagesTextOptionProps.find(({ value }) => value === collection.language),
    // },
    // categories: {
    //   opts: CategoriesTextOptionProps,
    //   selected: CategoriesTextOptionProps.find(({ value }) => value === collection.category),
    // },
    // licenses: {
    //   opts: LicenseIconTextOptionProps,
    //   selected: LicenseIconTextOptionProps.find(({ value }) => value === collection.license),
    // },
    // toggleLike: action('toggleLike'),
    // toggleBookmark: action('toggleBookmark'),
    deleteCollection: action('deleteCollection'),

    sendToMoodleLmsForm: useFormik<{ site?: string }>({
      initialValues: { site: 'http://my-lms.org' },
      onSubmit: action('Send to Moodle LMS'),
    }),
    isPublished: true,
    // setCategoryFilter: action('setCategoryFilter'),
    // setTypeFilter: action('setTypeFilter'),
    // setLevelFilter: action('setLevelFilter'),
    // setLanguageFilter: action('setLanguageFilter'),
    autoImageAdded: false,
    // canSearchImage: true,
    ...overrides?.props,
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
  const props = useCollectionStoryProps({})
  return <Collection {...props} />
}

export const Owner = () => {
  const props = useCollectionStoryProps({
    props: {
      isOwner: true,
      collectionUrl: 'https://picsum.photos/200/100',
      // autoImageAdded: true,
    },
  })
  return <Collection {...props} />
}

export const Admin = () => {
  const props = useCollectionStoryProps({
    props: {
      isOwner: true,
      isAdmin: true,
    },
  })
  return <Collection {...props} />
}

export default meta
