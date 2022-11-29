import { t } from '@lingui/macro'
import { fileExceedsMaxUploadSize } from '@moodlenet/common/dist/staticAsset/lib'
import { action } from '@storybook/addon-actions'
import { ComponentMeta } from '@storybook/react'
import { useFormik } from 'formik'
import { array, mixed, object, SchemaOf, string } from 'yup'
import { href } from '../../../elements/link'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { CollectionTextOptionProps } from './AddToCollections/storiesData'
import {
  LanguagesTextOptionProps,
  LevelTextOptionProps,
  TypeTextOptionProps,
} from './FieldsData'
import { NewResource } from './NewResource'
import { NewResourceFormValues } from './types'
import {
  CategoriesTextOptionProps,
  LicenseIconTextOptionProps,
} from './UploadResource/storiesData'

const maxUploadSize = 1024 * 1024 * 100

const meta: ComponentMeta<typeof NewResource> = {
  title: 'Pages/New Resource',
  component: NewResource,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'NewResourceStoryProps',
    'NewResourceContentUploadedStoryProps',
    'NewResourceImageUploadedStoryProps',
    'NewResourceCollectionsStoryProps',
    'NewResourceExtraDataStoryProps',
    'NewResourceAddToCollectionsStoryProps',
    'NewResourceExtraDetailsStoryProps',
    'NewResourceLinkUploadedStoryProps',
    'validationSchema',
  ],
}

export const validationSchema: SchemaOf<NewResourceFormValues> = object({
  category: string().required(t`Please select a subject`),
  license: string().when('content', (content, schema) => {
    return content instanceof Blob
      ? schema.required(t`Select a license`)
      : schema.optional()
  }),
  content: mixed()
    .test((v, { createError }) =>
      v instanceof Blob && fileExceedsMaxUploadSize(v.size, maxUploadSize)
        ? createError({
            message: t`The image is too big, reduce the size or use another image`,
          })
        : true
    )
    .required(t`Please provide a content`),
  description: string()
    .max(4096)
    .min(3)
    .required(t`Please provide a description`),
  name: string()
    .max(160)
    .min(3)
    .required(t`Please provide a title`),
  addToCollections: array().of(string()).optional(),
  image: mixed()
    .test((v, { createError }) =>
      v instanceof Blob && fileExceedsMaxUploadSize(v.size, maxUploadSize)
        ? createError({
            message: t`The image is too big, reduce the size or use another image`,
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

export const Default = () => {
  const form = useFormik<NewResourceFormValues>({
    onSubmit: action('submit'),
    validationSchema,
    initialValues: {
      addToCollections: [],
      category: '',
      // content: new File([], ''),
      content: '',
      description: '',
      name: '',
      visibility: 'Private',
    },
    initialErrors: {
      content: 'The file exceeds the max size',
    },
  })

  return (
    <NewResource
      // _initialProgressIndex={2}
      form={form}
      headerPageTemplateProps={{
        headerPageProps: HeaderPageLoggedInStoryProps,
        isAuthenticated: true,
        showSubHeader: false,
        mainPageWrapperProps: {
          userAcceptsPolicies: null,
          cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
        },
      }}
      addToCollectionsProps={{
        collections: {
          opts: CollectionTextOptionProps,
          selected: CollectionTextOptionProps.filter(
            ({ value }) => !!form.values.addToCollections?.includes(value)
          ),
        },
      }}
      extraDetailsProps={{
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
        setLanguageFilter: action('setLanguageFilter'),
        setLevelFilter: action('setLevelFilter'),
        setTypeFilter: action('setTypeFilter'),
      }}
      uploadResourceProps={{
        setCategoryFilter: action('search Category'),
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
        fileMaxSize: maxUploadSize,
      }}
    />
  )
}

export default meta
