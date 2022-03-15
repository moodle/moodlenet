import { t } from '@lingui/macro'
import { action } from '@storybook/addon-actions'
import { ComponentMeta } from '@storybook/react'
import { FormikConfig, useFormik } from 'formik'
import { useEffect } from 'react'
import { boolean, mixed, object, SchemaOf, string } from 'yup'
import { href } from '../../../elements/link'
import { TagListStory } from '../../../elements/tags'
import { HeaderLoggedOutStoryProps } from '../../organisms/Header/Header.stories'
import { HeaderPageTemplateProps } from '../../templates/HeaderPageTemplate'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { CollectionTextOptionProps } from '../NewResource/AddToCollections/storiesData'
import {
  LanguagesTextOptionProps,
  LevelTextOptionProps,
  MonthTextOptionProps,
  TypeTextOptionProps,
  YearsProps,
} from '../NewResource/ExtraDetails/storiesData'
import {
  CategoriesTextOptionProps,
  LicenseIconTextOptionProps,
  VisbilityIconTextOptionProps,
} from '../NewResource/UploadResource/storiesData'
import { ContributorCardStoryProps } from './ContributorCard/ContributorCard.stories'
import { Resource, ResourceFormValues, ResourceProps } from './Resource'

const maxUploadSize = 1024 * 1024 * 50

const meta: ComponentMeta<typeof Resource> = {
  title: 'Pages/Resource',
  component: Resource,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'resourceFormValues',
    'ResourceStoryProps',
    'resourceFormBag',
    'ResourceStoryProps',
    'ResourceLinkLoggedOutStoryProps',
    'ResourceFileLoggedOutStoryProps',
    'ResourceLoggedInStoryProps',
    'ResourceOwnerStoryProps',
    'ResourceAdminStoryProps',
    'validationSchema',
  ],
}

export const validationSchema: SchemaOf<ResourceFormValues> = object({
  category: string().required(t`Please select a subject`),
  license: string().when('isFile', (isFile, schema) => {
    return isFile ? schema.required(t`Select a license`) : schema.optional()
  }),
  isFile: boolean().required(),
  description: string()
    .max(4096)
    .min(3)
    .required(t`Please provide a description`),
  name: string()
    .max(160)
    .min(3)
    .required(t`Please provide a title`),
  image: mixed()
    .test((v, { createError }) =>
      v instanceof Blob && v.size > maxUploadSize
        ? createError({
            message: t`The file is too big, reduce the size or provide a url`,
          })
        : true
    )
    .optional(),
  language: string().optional(),
  level: string().optional(),
  month: string().optional(),
  type: string().optional(),
  visibility: mixed().required(t`Visibility is required`),
  year: string().when('month', (month, schema) => {
    return month ? schema.required(t`Please select a year`) : schema.optional()
  }),
})
export const resourceFormValues: ResourceFormValues = {
  isFile: true,
  visibility: VisbilityIconTextOptionProps[0]!.value,
  category: CategoriesTextOptionProps[2]!.value,
  description:
    'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
  image: 'https://picsum.photos/200/100',
  language: LanguagesTextOptionProps[2]!.value,
  level: LevelTextOptionProps[2]!.value,
  license: LicenseIconTextOptionProps[2]!.value,
  month: MonthTextOptionProps[8]!.value,
  year: YearsProps[20],
  name: 'The Best Resource Ever',
  type: TypeTextOptionProps[2]!.value,
}

export const ResourceStoryProps = (overrides?: {
  props?: Partial<ResourceProps>
  formConfig?: Partial<FormikConfig<ResourceFormValues>>
  formValues?: Partial<ResourceFormValues>
}): ResourceProps => {
  const form = useFormik<ResourceFormValues>({
    validationSchema,
    onSubmit: action('submit edit'),
    initialValues: {
      isFile: true,
      visibility: 'Public',
      category: CategoriesTextOptionProps[2]!.value,
      description:
        'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
      image: 'https://picsum.photos/600/300',
      language: LanguagesTextOptionProps[2]!.value,
      level: LevelTextOptionProps[2]!.value,
      license: LicenseIconTextOptionProps[2]!.value,
      month: MonthTextOptionProps[8]!.value,
      year: YearsProps[20],
      name: 'The Best Resource Ever',
      type: TypeTextOptionProps[2]!.value,
      ...overrides?.formValues,
    },
    ...overrides?.formConfig,
  })
  const addToCollectionsForm = useFormik<{ collections: string[] }>({
    initialValues: { collections: [] },
    onSubmit() {},
    validate({ collections: curr }) {
      const prev = addToCollectionsForm.values.collections
      const toAdd = curr.filter((_) => !prev.includes(_))[0]
      const toRemove = prev.filter((_) => !curr.includes(_))[0]
      toAdd && action('Add ')(toAdd)
      toRemove && action('Remove ')(toRemove)
    },
  })
  useEffect(
    () =>
      action('changed addToCollectionsForm.values')(
        addToCollectionsForm.values.collections.join(';')
      ),
    [addToCollectionsForm.values.collections]
  )

  return {
    form,
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
    liked: false,
    numLikes: 23,
    bookmarked: true,
    tags: TagListStory,
    contributorCardProps: ContributorCardStoryProps,
    contentUrl: '#',
    contentType: 'link',
    resourceFormat: 'Video',
    collections: {
      opts: CollectionTextOptionProps,
      selected: CollectionTextOptionProps.filter(
        ({ value }) =>
          !!addToCollectionsForm.values.collections?.includes(value)
      ),
    },
    types: {
      opts: TypeTextOptionProps,
      selected: TypeTextOptionProps.find(
        ({ value }) => value === form.values.type
      ),
    },
    levels: {
      opts: LevelTextOptionProps,
      selected: LevelTextOptionProps.find(
        ({ value }) => value === form.values.level
      ),
    },
    languages: {
      opts: LanguagesTextOptionProps,
      selected: LanguagesTextOptionProps.find(
        ({ value }) => value === form.values.language
      ),
    },
    categories: {
      opts: CategoriesTextOptionProps,
      selected: CategoriesTextOptionProps.find(
        ({ value }) => value === form.values.category
      ),
    },
    licenses: {
      opts: LicenseIconTextOptionProps,
      selected: LicenseIconTextOptionProps.find(
        ({ value }) => value === form.values.license
      ),
    },
    toggleLikeForm: useFormik({
      initialValues: {},
      onSubmit: action('toggleLike'),
    }),
    toggleBookmarkForm: useFormik({
      initialValues: {},
      onSubmit: action('toggleBookmark'),
    }),
    deleteResourceForm: useFormik({
      initialValues: {},
      onSubmit: action('Delete Resource'),
    }),
    sendToMoodleLmsForm: useFormik<{ site?: string }>({
      initialValues: { site: 'http://my-lms.org' },
      onSubmit: action('Send to Moodle LMS'),
    }),
    addToCollectionsForm,
    setCategoryFilter: action('setCategoryFilter'),
    setTypeFilter: action('setTypeFilter'),
    setLevelFilter: action('setLevelFilter'),
    setLanguageFilter: action('setLanguageFilter'),

    ...overrides?.props,
  }
}

const headerPageTemplatePropsUnauth: HeaderPageTemplateProps = {
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
}
export const LinkLoggedOut = () => {
  const props = ResourceStoryProps({
    props: {
      headerPageTemplateProps: headerPageTemplatePropsUnauth,
      isAuthenticated: false,
    },
  })

  return <Resource {...props} />
}

export const FileLoggedOut = () => {
  const props = ResourceStoryProps({
    props: {
      headerPageTemplateProps: headerPageTemplatePropsUnauth,
      isAuthenticated: false,
      contentType: 'file',
      contentUrl: 'https://picsum.photos/200/100',
      resourceFormat: 'Video',
    },
  })
  return <Resource {...props} />
}

export const LoggedIn = () => {
  const props = ResourceStoryProps({})
  return <Resource {...props} />
}

export const Owner = () => {
  const props = ResourceStoryProps({
    props: {
      isOwner: true,
    },
  })
  return <Resource {...props} />
}

export const Admin = () => {
  const props = ResourceStoryProps({
    props: {
      isOwner: true,
      isAdmin: true,
    },
  })
  return <Resource {...props} />
}

export default meta
