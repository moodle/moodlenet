import type {
  CollectionAccessProps,
  CollectionActions,
  CollectionDataProps,
  CollectionFormProps,
  CollectionStateProps,
} from '@moodlenet/collection/common'
import { action } from '@storybook/addon-actions'
import type { ComponentMeta } from '@storybook/react'
import type { PartialDeep } from 'type-fest'
// import { useEffect } from 'react'
import type { AnySchema, SchemaOf } from 'yup'
import { addMethod, boolean, mixed, MixedSchema, object, string } from 'yup'
// import { href } from '../../../elements/link'
// import { TagListStory } from '../../../elements/tags'
// import { HeaderLoggedOutStoryProps } from '../../organisms/Header/Header.stories'
// import { HeaderPageTemplateProps } from '../../templates/HeaderPageTemplate'
// import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
// import { CollectionTextOptionProps } from '../NewCollection/AddToCollections/storiesData'
import type { OptionItemProp } from '@moodlenet/component-library'
// import {
//   CategoriesTextOptionProps,
//   LicenseIconTextOptionProps,
//   VisbilityIconTextOptionProps,
// } from '../NewCollection/UploadCollection/storiesData'
import { CollectionContributorCardStories } from '@moodlenet/collection/stories'
// import { Collection, CollectionProps } from '@moodlenet/collection/ui'
// import { useFormik } from 'formik'
import type { CollectionProps, MainCollectionCardSlots } from '@moodlenet/collection/ui'
import { Collection } from '@moodlenet/collection/ui'
import { overrideDeep } from '@moodlenet/component-library/common'
import type { ResourceCardProps } from '@moodlenet/ed-resource/ui'
import type { BookmarkButtonProps, SmallFollowButtonProps } from '@moodlenet/web-user/ui'
import { BookmarkButton, FollowButton, SmallFollowButton } from '@moodlenet/web-user/ui'
import { getResourcesCardStoryProps } from 'components/organisms/ResourceCard/story-props.js'
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
    'CollectionFormProps',
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

export const validationSchema: SchemaOf<CollectionFormProps> = object({
  category: string().required(/* t */ `Please select a subject`),
  content: string().required(/* t */ `Please upload a content`),

  license: string().when('isFile', (isFile, schema) => {
    return isFile ? schema.required(/* t */ `Select a license`) : schema.optional()
  }),
  isFile: boolean().required(),
  description: string().max(4096).min(3).required(/* t */ `Please provide a description`),
  title: string().max(160).min(3).required(/* t */ `Please provide a title`),
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

export const collectionFormProps: CollectionFormProps = {
  description:
    'Earth 2020: An Insider’s Guide to a Rapidly Changing Planet responds to a public increasingly concerned about the deterioration of Earth’s natural systems, offering readers a wealth of perspectives on our shared ecological past, and on the future trajectory of planet Earth. Written by world-leading thinkers on the front-lines of global change research and policy, this multi-disciplinary collection maintains a dual focus: some essays investigate specific facets of the physical Earth system, while others explore the social, legal and political dimensions shaping the human environmental footprint. In doing so, the essays collectively highlight the urgent need for collaboration across diverse domains of expertise in addressing one of the most significant challenges facing us today. Earth 2020 is essential reading for everyone seeking a deeper understanding of the past, present and future of our planet, and the role of humanity in shaping this trajectory.',
  // image: 'https://picsum.photos/200/100',
  title: '',
}

export const useCollectionForm = (overrides?: Partial<CollectionFormProps>) => {
  return useFormik<CollectionFormProps>({
    validationSchema,
    onSubmit: action('submit edit'),
    initialValues: {
      title: 'Best collection ever',
      description:
        'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
      // image:
      //   'https://images.unsplash.com/photo-1543964198-d54e4f0e44e3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
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
  overrides?: PartialDeep<
    CollectionProps & {
      isAuthenticated: boolean
      bookmarkButtonProps: BookmarkButtonProps
      smallFollowButtonProps: SmallFollowButtonProps
    }
  >,
): CollectionProps => {
  const isAuthenticated = overrides?.isAuthenticated ?? true

  const data: CollectionDataProps = {
    collectionId: 'qjnwglkd69io-sports',
    mnUrl: 'collection.url',
    imageUrl:
      'https://images.unsplash.com/photo-1543964198-d54e4f0e44e3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    ...overrides?.data,
  }

  const collectionForm: CollectionFormProps = {
    title: 'Best collection ever',
    description:
      'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find.',
    // ...overrides?.collectionForm,
  }

  const state: CollectionStateProps = {
    isPublished: true,
    numResources: 12,
  }

  const actions: CollectionActions = {
    deleteCollection: action('deleteCollection'),
    editData: action('editData'),
    publish: action('publish'),
    unpublish: action('unpublish'),
    setImage: action('setImage'),
    ...overrides?.actions,
  }

  const access: CollectionAccessProps = {
    canEdit: false,
    isCreator: false,
    canDelete: false,
    canPublish: false,
    ...overrides?.access,
  }

  const smallFollowButtonProps: SmallFollowButtonProps = {
    canFollow: true,
    followed: false,
    isCreator: true,
    numFollowers: 11,
    toggleFollow: action('toggleFollow'),
    ...overrides?.smallFollowButtonProps,
    isAuthenticated,
  }
  const bookmarkButtonProps: BookmarkButtonProps = {
    bookmarked: true,
    canBookmark: true,
    toggleBookmark: action('toggleBookmark'),
    ...overrides?.bookmarkButtonProps,
    isAuthenticated,
  }
  const isPublished =
    overrides?.state?.isPublished !== undefined ? overrides?.state?.isPublished : true

  const mainCollectionCardSlots: MainCollectionCardSlots = {
    mainColumnItems: [],
    headerColumnItems: [],
    topLeftHeaderItems: [],
    topRightHeaderItems: [
      isPublished
        ? {
            Item: () => <SmallFollowButton {...smallFollowButtonProps} />,
            key: 'follow-button',
          }
        : null,
      isPublished
        ? {
            Item: () => <BookmarkButton {...bookmarkButtonProps} />,
            key: 'like-button',
          }
        : null,
    ],
    moreButtonItems: [],
    footerRowItems: [
      !overrides?.access?.isCreator
        ? {
            Item: () => <FollowButton {...smallFollowButtonProps} key="follow-button" />,
            key: 'follow-button',
          }
        : null,
    ],
  }

  const accessOverrides = overrides?.access

  const resourceCardPropsList: ResourceCardProps[] =
    overrides?.resourceCardPropsList?.length === 0
      ? []
      : getResourcesCardStoryProps(6, {
          access: {
            ...access,
            ...accessOverrides,
          },
          orientation: 'horizontal',
        })

  return overrideDeep<CollectionProps>(
    {
      mainLayoutProps: isAuthenticated
        ? MainLayoutLoggedInStoryProps
        : MainLayoutLoggedOutStoryProps,

      mainCollectionCardSlots: mainCollectionCardSlots,
      mainColumnItems: [],
      extraDetailsItems: [],
      moreButtonItems: [],
      sideColumnItems: [],
      wideColumnItems: [],

      resourceCardPropsList: resourceCardPropsList.map((resourceCardProps, i) => ({
        key: `${i}`,
        resourceCardProps,
      })),

      collectionContributorCardProps:
        CollectionContributorCardStories.CollectionContributorCardStoryProps,

      data: data,
      collectionForm: collectionForm,
      validationSchema: validationSchema,

      state: state,
      actions: actions,
      access: access,
      isSaving: false,
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
