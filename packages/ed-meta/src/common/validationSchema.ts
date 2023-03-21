import { object, SchemaOf, string } from 'yup'

export const subjectValidationSchema: SchemaOf<{ subject: string }> = object({
  subject: string().required(`Please select a subject`),
})

export const licenseValidationSchema: SchemaOf<{ license: string }> = object({
  //TODO //@BRU //@ETTO //@ALE Update this validation scheme so is optional for links
  license: string().required(`Please select a license`),
  // license: string().when('isFile', (isFile, schema) => {
  //   return isFile ? schema.required(`Select a license`) : schema.optional()
  // }),
})

// isFile: boolean().required(),
// description: string()
//   .max(4096)
//   .min(3)
//   .required(`Please provide a description`),
// name: string()
//   .max(160)
//   .min(3)
//   .required(`Please provide a title`),
// image: mixed()
//   .test((v, { createError }) =>
//     v instanceof Blob && v.size > maxUploadSize
//       ? createError({
//           message: `The file is too big, reduce the size or provide a url`,
//         })
//       : true
//   )
//   .optional(),
// language: string().optional(),
// level: string().optional(),
// month: string().optional(),
// type: string().optional(),
// visibility: mixed().required(`Visibility is required`),
// year: string().when('month', (month, schema) => {
//   return month ? schema.required(`Please select a year`) : schema.optional()
// }),
