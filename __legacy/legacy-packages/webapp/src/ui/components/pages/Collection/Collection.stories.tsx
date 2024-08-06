import { t } from '@lingui/macro'
import { action } from '@storybook/addon-actions'
import { ComponentMeta } from '@storybook/react'
import { FormikConfig, useFormik } from 'formik'
import { mixed, object, SchemaOf, string } from 'yup'
import { href } from '../../../elements/link'
import {
  ResourceCardOwnerBookmarkedStoryProps,
  ResourceCardOwnerStoryProps,
  ResourceCardStoryProps,
} from '../../molecules/cards/ResourceCard/ResourceCard.stories'
import { HeaderLoggedOutStoryProps } from '../../organisms/Header/Header.stories'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { NewCollectionFormValues } from '../NewCollection/types'
import { Collection, CollectionProps } from './Collection'
import { ContributorCardStoryProps } from './ContributorCard/ContributorCard.stories'

const maxUploadSize = 1024 * 1024 * 50

const meta: ComponentMeta<typeof Collection> = {
  title: 'Pages/Collection',
  component: Collection,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'CollectionStoryProps',
    'CollectionLoggedOutStoryProps',
    'CollectionLoggedInStoryProps',
    'CollectionOwnerStoryProps',
    'CollectionAdminStoryProps',
    'validationSchema',
  ],
}

export const validationSchema: SchemaOf<NewCollectionFormValues> = object({
  description: string()
    .max(4096)
    .min(3)
    .required(t`Please provide a description`),
  title: string()
    .max(160)
    .min(3)
    .required(t`Please provide a title`),
  image: mixed()
    .test((v, { createError }) =>
      v instanceof Blob && v.size > maxUploadSize
        ? createError({
            message: t`The image is too big, reduce the size or use another image`,
          })
        : true
    )
    .optional(),
  visibility: mixed().required(t`Visibility is required`),
})
export const CollectionStoryProps = (overrides?: {
  props?: Partial<CollectionProps>
  formConfig?: Partial<FormikConfig<NewCollectionFormValues>>
  formValues?: Partial<NewCollectionFormValues>
}): CollectionProps => {
  const form = useFormik<NewCollectionFormValues>({
    validationSchema,
    onSubmit: action(' update collection'),
    initialValues: {
      description:
        'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
      image: { location: 'https://picsum.photos/200/100' },
      title: 'Best collection ever',
      visibility: 'Public',
      ...overrides?.formValues,
    },
    ...overrides?.formConfig,
  })
  return {
    collectionId: 'wj0e6mv6j8om-test',
    headerPageTemplateProps: {
      headerPageProps: HeaderPageLoggedInStoryProps,
      isAuthenticated: true,
      mainPageWrapperProps: {
        userAcceptsPolicies: null,
        cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
      },
    },
    isAuthenticated: true,
    isOwner: false,
    isAdmin: false,
    isFollowing: false,
    numFollowers: 23,
    bookmarked: false,
    contributorCardProps: ContributorCardStoryProps,

    form,
    resourceCardPropsList: [
      ResourceCardOwnerStoryProps,
      ResourceCardOwnerBookmarkedStoryProps,
      ResourceCardStoryProps(),
    ],
    reportForm: useFormik<{ comment: string }>({
      initialValues: { comment: '' },
      onSubmit: action('submit report Form'),
    }),
    collectionUrl: 'collection.url',
    toggleFollow: useFormik({
      initialValues: {},
      onSubmit: action('toggle Follow'),
    }),
    toggleBookmark: useFormik({
      initialValues: {},
      onSubmit: action('toggle Bookmark'),
    }),
    deleteCollection: useFormik({
      initialValues: {},
      onSubmit: action('delete Collection'),
    }),
    autoImageAdded: false,
    canSearchImage: true,
    ...overrides?.props,
  }
}

export const LoggedOut = () => {
  const props = CollectionStoryProps({
    props: {
      isAuthenticated: false,
      headerPageTemplateProps: {
        isAuthenticated: false,
        headerPageProps: {
          headerProps: {
            ...HeaderLoggedOutStoryProps,
            me: null,
          },
        },
        mainPageWrapperProps: {
          userAcceptsPolicies: null,
          cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
        },
      },
    },
  })
  return <Collection {...props} />
}

export const LoggedIn = () => {
  const props = CollectionStoryProps()
  return <Collection {...props} />
}
export const Owner = () => {
  const props = CollectionStoryProps({
    props: {
      isOwner: true,
      // autoImageAdded: true,
    },
  })
  return <Collection {...props} />
}
export const Admin = () => {
  const props = CollectionStoryProps({
    props: {
      isOwner: true,
      isAdmin: true,
    },
  })
  return <Collection {...props} />
}
export default meta
