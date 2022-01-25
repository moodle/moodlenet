import { t } from '@lingui/macro'
import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { FormikConfig, useFormik } from 'formik'
import { mixed, object, SchemaOf, string } from 'yup'
import { NewCollectionFormValues } from '../types'
import { CreateCollection, CreateCollectionProps } from './CreateCollection'

const meta: ComponentMeta<typeof CreateCollection> = {
  title: 'Pages/New Collection/Create Collection',
  component: CreateCollection,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'useCreateCollectionStoryProps',
    'Default',
    'validationSchema',
  ],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 1100 }}>
        <Story />
      </div>
    ),
  ],
}

export const validationSchema: SchemaOf<NewCollectionFormValues> = object({
  description: string().required(t`Please provide a Description`),
  title: string().required(t`Please provide a title`),
  image: mixed().optional(),
  visibility: mixed().required(t`Visibility is required`),
})

export const useCreateCollectionStoryProps = (overrides?: {
  formValues?: Partial<NewCollectionFormValues>
  formConfig?: Partial<FormikConfig<NewCollectionFormValues>>
  props?: Partial<CreateCollectionProps>
}): CreateCollectionProps => {
  const form = useFormik<NewCollectionFormValues>({
    onSubmit: action('create Collection'),
    validationSchema,
    initialValues: {
      description: '',
      title: '',
      visibility: 'Private',
      ...overrides?.formValues,
    },
    ...overrides?.formConfig,
  })
  return {
    step: 'CreateCollectionStep',
    form,

    ...overrides?.props,
  }
}
type CreateCollectionStory = ComponentStory<typeof CreateCollection>
export const Default: CreateCollectionStory = () => {
  const props = useCreateCollectionStoryProps()
  return <CreateCollection {...props} />
}

export default meta
