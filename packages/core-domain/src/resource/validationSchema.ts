import {
  array,
  mixed,
  number,
  NumberSchema,
  object,
  SchemaOf,
  string,
  StringSchema,
  ValidationError,
} from 'yup'
import { humanFileSize } from '../common/utils/validations.js'
import {
  ProvidedCreationContent,
  ProvidedImage,
  ResourceMeta,
  ValidationConfigs,
} from './exports.js'

export type ValidationSchemas = ReturnType<typeof getValidationSchemas>
export function getValidationSchemas(validationConfigs: ValidationConfigs) {
  const schemas = {
    publishing: getResourceMetaValidationSchema({ type: `publish` }),
    meta: getResourceMetaValidationSchema({ type: `draft` }),
    providedContent: getContentValidationSchema(),
    providedImage: getImageValidationSchema(),
  }

  return {
    schemas,
    publishable(meta: ResourceMeta) {
      try {
        return {
          valid: true,
          meta: schemas.publishing.validateSync(meta, { abortEarly: false }) as ResourceMeta,
        } as const
      } catch (e) {
        return {
          valid: false,
          errors: produceResourceMetaValidationErrorsInCatch(e),
        } as const
      }
    },
    resourceMeta(meta: ResourceMeta) {
      try {
        return {
          valid: true,
          meta: schemas.meta.validateSync(meta, { abortEarly: false }) as ResourceMeta,
        } as const
      } catch (e) {
        return {
          valid: false,
          errors: produceResourceMetaValidationErrorsInCatch(e),
        } as const
      }
    },
    providedContent(providedContent: ProvidedCreationContent) {
      try {
        return {
          valid: true,
          providedContent: schemas.providedContent.validateSync(providedContent, {
            abortEarly: false,
          }), //as ProvidedCreationContent,
        } as const
      } catch (e) {
        return { valid: false, reason: String(e) } as const
      }
    },
    providedImage(providedImage: ProvidedImage) {
      try {
        return {
          valid: true,
          data: schemas.providedImage.validateSync(providedImage, {
            abortEarly: false,
          }) as unknown as ProvidedImage,
          errors: null,
        } as const
      } catch (e) {
        return {
          valid: false,
          errors: produceResourceMetaValidationErrorsInCatch(e),
        } as const
      }
    },
  }

  function getImageValidationSchema() {
    const schema /* : SchemaOf<ProvidedImage >  */ = mixed<ProvidedImage>()
      .test((providedImage, { createError }) => {
        return (
          !!providedImage &&
          (providedImage.kind === `url`
            ? validURL(providedImage.url) ||
              createError({
                message: `Url not valid`,
              })
            : providedImage.size <= validationConfigs.image.sizeBytes.max ||
              createError({
                message: `Image too big ${humanFileSize(providedImage.size)}, max ${humanFileSize(
                  validationConfigs.image.sizeBytes.max,
                )}`,
              }))
        )
      })
      .optional()
    return schema
  }

  function produceResourceMetaValidationErrorsInCatch(e: any) {
    // console.log(`produceResourceMetaValidationErrorsInCatch`, e, e instanceof ValidationError)
    if (!(e instanceof ValidationError)) {
      throw e
    }
    if (!e.inner.length) {
      return null
    }
    return e.inner.reduce((acc, err) => {
      const k = err.path ?? `?`
      acc[k] = acc[k] ?? ``
      acc[k] = acc[k] + ` ` + err.message
      return acc
    }, {} as any)
  }
  function getContentValidationSchema() {
    const schema /* : SchemaOf<ProvidedCreationContent |undefined>  */ =
      mixed<ProvidedCreationContent>().test((content, { createError }) => {
        // console.log({ content })
        const errors = !content
          ? createError({ message: `Please provide a file or a link` })
          : content.kind === `link`
          ? validURL(content.url) ||
            createError({
              message: `Link not valid`,
            })
          : content.kind === `file`
          ? content.size <= validationConfigs.content.sizeBytes.max ||
            createError({
              message: `File too big ${humanFileSize(content.size)}, max ${humanFileSize(
                validationConfigs.content.sizeBytes.max,
              )}`,
            })
          : createError({
              message: `Invalid content type`,
            })
        return errors
      }) //.required()

    return schema
  }

  function getResourceMetaValidationSchema({ type }: { type: `publish` | `draft` }) {
    const forPublish = type === `publish`
    const schema: SchemaOf<ResourceMeta> = object({
      title: string()
        .max(
          validationConfigs.meta.title.length.max,
          obj =>
            `Please provide a shorter title (${obj.value.length} / ${validationConfigs.meta.title.length.max})`,
        )
        .withMutation(s =>
          forPublish
            ? s
                .min(
                  validationConfigs.meta.title.length.min,
                  obj =>
                    `Please provide a longer title (${obj.value.length} < ${validationConfigs.meta.title.length.min})`,
                )
                .required(`Please provide a title`)
            : s,
        )
        .default(``),
      description: string()
        .max(
          validationConfigs.meta.description.length.max,
          obj =>
            `Please provide a shorter description (${obj.value.length} / ${validationConfigs.meta.description.length.max})`,
        )
        .withMutation(s =>
          forPublish
            ? s
                .min(
                  validationConfigs.meta.description.length.min,
                  obj =>
                    `Please provide a longer description (${obj.value.length} < ${validationConfigs.meta.description.length.min})`,
                )
                .required(`Please provide a description`)
            : s,
        )
        .default(``),
      subject: object({
        code: string().required() as StringSchema<string>, // TODO CHECK Codes
      }).withMutation(s =>
        forPublish ? s.required(`Please select a subject`) : s.default(null).nullable(),
      ),
      license: object({
        code: string().required() as StringSchema<string>, // TODO CHECK Codes
      }).withMutation(s =>
        forPublish ? s.required(`Please provide a license`) : s.default(null).nullable(),
      ),
      language: object({
        code: string().required() as StringSchema<string>, // TODO CHECK Codes
      }).withMutation(s =>
        forPublish ? s.required(`Please provide a language`) : s.default(null).nullable(),
      ),
      level: object({
        code: string().required() as StringSchema<string>, // TODO CHECK Codes
      }).withMutation(s =>
        forPublish ? s.required(`Please provide a level`) : s.default(null).nullable(),
      ),
      type: object({
        code: string().required() as StringSchema<string>, // TODO CHECK Codes
      }).withMutation(s =>
        forPublish ? s.required(`Please provide a type`) : s.default(null).nullable(),
      ),
      originalPublicationInfo: object({
        month: number().required() as NumberSchema<number>,
        year: number().required() as NumberSchema<number>,
      }).withMutation(s =>
        forPublish
          ? s.required(`Please provide original publication info`)
          : s.default(null).nullable(),
      ),
      learningOutcomes: array()
        .default([])
        .of(
          object()
            .required()
            .shape({
              sentence: string()
                .max(
                  validationConfigs.meta.learningOutcomes.sentence.length.max,
                  obj =>
                    `Please provide a shorter sentence (${obj.value.length} / validationConfigs.meta.learningOutcomes.sentence.length.max)`,
                )
                .withMutation(s =>
                  forPublish
                    ? s
                        .min(
                          validationConfigs.meta.learningOutcomes.sentence.length.min,
                          obj =>
                            `Please provide a longer sentence (${obj.value.length} < validationConfigs.meta.learningOutcomes.sentence.length.min)`,
                        )
                        .required(`Please provide a sentence`)
                    : s,
                ) as StringSchema<string>, // TODO CHECK Codes,
            }),
        )
        .withMutation(s =>
          forPublish
            ? s
                .min(
                  validationConfigs.meta.learningOutcomes.amount.min,
                  `Please provide at least ${validationConfigs.meta.learningOutcomes.amount.min} learning outcome`,
                )
                .max(
                  validationConfigs.meta.learningOutcomes.amount.max,
                  `Please provide at most ${validationConfigs.meta.learningOutcomes.amount.max} learning outcomes`,
                )
                .required(
                  `Please provide at least ${validationConfigs.meta.learningOutcomes.amount.min} learning outcome`,
                )
            : s,
        ),
    })
    return schema
  }
}

export const validURL = (str: string) => {
  try {
    new URL(str)
    return true
  } catch (err) {
    return false
  }
  // This oculd also be done using @diegoperini regex, the most complete accordint to https://mathiasbynens.be/demo/url-regex
}
