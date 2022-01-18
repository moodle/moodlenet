import { action } from '@storybook/addon-actions'
import { ComponentMeta } from '@storybook/react'
import { useFormik } from 'formik'
import { href } from '../../../elements/link'
import { SBSimplifiedForm } from '../../../lib/storybook/SBFormikBag'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { AddToCollectionsStoryProps } from './AddToCollections/AddToCollections.stories'
import { CollectionTextOptionProps } from './AddToCollections/storiesData'
import { ExtraDetailsStoryProps } from './ExtraDetails/ExtraDetails.stories'
import { MonthTextOptionProps, YearsProps } from './ExtraDetails/storiesData'
import { NewResource, NewResourceProps } from './NewResource'
import { NewResourceFormValues } from './types'
import { UploadResourceStoryProps } from './UploadResource/UploadResource.stories'

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

export const NewResourceStoryProps: NewResourceProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedInStoryProps,
    isAuthenticated: true,
    showSubHeader: false,
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
  },
  uploadResourceProps: UploadResourceStoryProps,
  addToCollectionsProps: AddToCollectionsStoryProps,
  extraDetailsProps: ExtraDetailsStoryProps,
  form: SBSimplifiedForm({}),
}

export const Start = () => {
  const form = useFormik<NewResourceFormValues>({
    onSubmit: action('submit'),
    initialValues: {},
  })

  return <NewResource {...NewResourceStoryProps} form={form} />
}

export const FileUploaded = () => {
  const form = useFormik<NewResourceFormValues>({
    onSubmit: action('submit'),
    initialValues: {
      content: new File([], 'uploaded-file.ext'),
    },
  })
  return <NewResource {...NewResourceStoryProps} form={form} />
}

export const LinkUploaded = () => {
  const form = useFormik<NewResourceFormValues>({
    onSubmit: action('submit'),
    initialValues: {
      content: 'example.com',
    },
  })
  return <NewResource {...NewResourceStoryProps} form={form} />
}

export const ImageUploaded = () => {
  const form = useFormik<NewResourceFormValues>({
    onSubmit: action('submit'),
    initialValues: {
      content: 'example.com',
      image: 'https://picsum.photos/200/100',
    },
  })
  return <NewResource {...NewResourceStoryProps} form={form} />
}

export const AddToCollections = () => {
  const selected = [
    CollectionTextOptionProps[2]!,
    CollectionTextOptionProps[5]!,
  ]
  const form = useFormik<NewResourceFormValues>({
    onSubmit: action('submit'),
    initialValues: {
      addToCollections: selected.map(({ value }) => value),
      content: 'example.com',
      name: 'resource name',
      description: 'resource description',
      visibility: 'private',
    },
  })
  return (
    <NewResource
      {...NewResourceStoryProps}
      form={form}
      initialProgressIndex={1}
      addToCollectionsProps={{
        collections: {
          opts: CollectionTextOptionProps,
          selected:
            form.values.addToCollections?.map(
              (val) => CollectionTextOptionProps.find((_) => _.value === val)!
            ) ?? [],
        },
      }}
    />
  )
}

export const ExtraDetails = () => {
  const form = useFormik<NewResourceFormValues>({
    onSubmit: action('submit'),
    initialValues: {
      addToCollections: CollectionTextOptionProps.slice(1, 2).map(
        ({ value }) => value
      ),
      name: 'resource name',
      description: 'resource description',
      content: 'example.com',
      visibility: 'private',
      month: MonthTextOptionProps[2]?.value,
      year: YearsProps[2],
    },
  })
  return (
    <NewResource
      {...NewResourceStoryProps}
      form={form}
      initialProgressIndex={2}
    />
  )
}

export default meta
