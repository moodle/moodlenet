import { FormikHandle } from '@moodlenet/react-app/ui'
import { useFormik } from 'formik'
import { boolean, mixed, object, SchemaOf, string } from 'yup'
import { maxUploadSize, ResourceFormValues } from '../../../../common.mjs'
import { useResourceBaseProps } from '../../../../ResourceHooks.js'
import { empityResourceForm } from '../../../../server/mockLib.mjs'

export const validationSchema: SchemaOf<ResourceFormValues> = object({
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

export const useResourceForm = (resourceKey: string): FormikHandle<ResourceFormValues> => {
  const baseProps = useResourceBaseProps({ resourceKey })
  const edit = baseProps?.actions?.editResource
  const initialValues = baseProps?.props.resourceForm || empityResourceForm.resourceForm

  return useFormik<ResourceFormValues>({
    validationSchema,
    onSubmit: values => edit && edit(values),
    initialValues,
  })
}
