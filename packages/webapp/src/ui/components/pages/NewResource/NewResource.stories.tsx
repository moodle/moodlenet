import { t } from '@lingui/macro'
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
} from './ExtraDetails/storiesData'
import { NewResource } from './NewResource'
import { NewResourceFormValues } from './types'
import {
  CategoriesTextOptionProps,
  LicenseIconTextOptionProps,
} from './UploadResource/storiesData'

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
  ],
}

const validationSchema: SchemaOf<NewResourceFormValues> = object({
  category: string().required(t`Please provide a Category`),
  license: string().when('content', (content, schema) => {
    return content instanceof Blob
      ? schema.required(t`Need a License for uploaded content`)
      : schema.optional()
  }),
  content: mixed().required(t`Content is a required field`),
  description: string().required(t`Please provide a Description`),
  name: string().required(t`Please provide a title`),
  addToCollections: array().of(string()).optional(),
  image: mixed().optional(),
  language: string().optional(),
  level: string().optional(),
  month: string().optional(),
  type: string().optional(),
  visibility: mixed().required(t`Visibility is required`),
  year: string().when('month', (month, schema) => {
    return month
      ? schema.required(t`Need an year if you choosed month`)
      : schema.optional()
  }),
})

export const Default = () => {
  const form = useFormik<NewResourceFormValues>({
    onSubmit: action('submit'),
    validationSchema,
    initialValues: {},
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
      }}
      uploadResourceProps={{
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
      }}
    />
  )
}

export default meta
