import { humanFileSize, type AssetInfoForm } from '@moodlenet/component-library/common'
import type { SchemaOf } from 'yup'
import { array, mixed, object, string } from 'yup'
import type { ResourceFormProps } from './types.mjs'

export type ValidationsConfig = {
  contentMaxUploadSize: number
  imageMaxUploadSize: number
  titleLength: { max: number; min: number }
  descriptionLength: { max: number; min: number }
  learningOutcomes: {
    amount: { min: number; max: number }
    sentenceLength: { max: number; min: number }
  }
}

export type ValidationSchemas = ReturnType<typeof getValidationSchemas>
export function getValidationSchemas(validationConfigs: ValidationsConfig) {
  const publishedResourceValidationSchema = getResourceValidationSchema({ type: 'publish' })
  const draftResourceValidationSchema = getResourceValidationSchema({ type: 'draft' })
  const publishedContentValidationSchema = getContentValidationSchema({ type: 'publish' })
  const draftContentValidationSchema = getContentValidationSchema({ type: 'draft' })

  const imageValidationSchema: SchemaOf<{ image: AssetInfoForm | undefined | null }> = object({
    image: mixed()
      .test((v: AssetInfoForm, { createError }) => {
        const loc: string | File | undefined | null = v?.location
        return (
          !loc ||
          (typeof loc === 'string'
            ? validURL(loc) ||
              createError({
                message: `Url not valid`,
              })
            : loc.size <= validationConfigs.imageMaxUploadSize ||
              createError({
                message: `Image too big ${humanFileSize(loc.size)}, max ${humanFileSize(
                  validationConfigs.imageMaxUploadSize,
                )}`,
              }))
        )
      })
      .optional(),
  })

  return {
    publishedResourceValidationSchema,
    draftResourceValidationSchema,
    publishedContentValidationSchema,
    draftContentValidationSchema,
    imageValidationSchema,
  }

  function getContentValidationSchema({ type }: { type: 'publish' | 'draft' }) {
    const forPublish = type === 'publish'
    const schema: SchemaOf<{ content: File | string | undefined | null }> = object({
      content: mixed()
        .test((v: File | string | undefined | null, { createError }) => {
          const errors =
            !v ||
            (typeof v === 'string'
              ? validURL(v) ||
                createError({
                  message: `Link not valid`,
                })
              : v.size <= validationConfigs.contentMaxUploadSize ||
                createError({
                  message: `File too big ${humanFileSize(v.size)}, max ${humanFileSize(
                    validationConfigs.contentMaxUploadSize,
                  )}`,
                }))
          return errors
        })
        .withMutation(s =>
          forPublish ? s.required(`Please upload a content or a link`) : s.optional(),
        ),
    })
    return schema
  }

  function getResourceValidationSchema({ type }: { type: 'publish' | 'draft' }) {
    const forPublish = type === 'publish'
    const schema: SchemaOf<ResourceFormProps> = object({
      title: string()
        .max(
          validationConfigs.titleLength.max,
          obj =>
            `Please provide a shorter title (${obj.value.length} / ${validationConfigs.titleLength.max})`,
        )
        .withMutation(s =>
          forPublish
            ? s
                .min(
                  validationConfigs.titleLength.min,
                  obj =>
                    `Please provide a longer title (${obj.value.length} < ${validationConfigs.titleLength.min})`,
                )
                .required(`Please provide a title`)
            : s,
        )
        .default(''),
      description: string()
        .max(
          validationConfigs.descriptionLength.max,
          obj =>
            `Please provide a shorter description (${obj.value.length} / ${validationConfigs.descriptionLength.max})`,
        )
        .withMutation(s =>
          forPublish
            ? s
                .min(
                  validationConfigs.descriptionLength.min,
                  obj =>
                    `Please provide a longer description (${obj.value.length} < ${validationConfigs.descriptionLength.min})`,
                )
                .required(`Please provide a description`)
            : s,
        )
        .default(''),
      subject: string()
        .withMutation(s => (forPublish ? s.required(`Please select a subject`) : s))
        .default(''),
      license: string()
        .withMutation(s => (forPublish ? s.required(`Please provide a license`) : s))
        .default(''),
      language: string()
        .withMutation(s => (forPublish ? s.required(`Please provide a language`) : s))
        .default(''),
      level: string()
        .withMutation(s => (forPublish ? s.required(`Please provide a level`) : s))
        .default(''),
      month: string()
        .withMutation(s => (forPublish ? s.required(`Please provide a month`) : s))
        .default(''),
      year: string()
        .withMutation(s => (forPublish ? s.required(`Please provide a year`) : s))
        .default(''),
      type: string()
        .withMutation(s => (forPublish ? s.required(`Please provide a type`) : s))
        .default(''),
      learningOutcomes: array()
        .of(
          object().shape({
            sentence: string()
              .max(
                validationConfigs.learningOutcomes.sentenceLength.max,
                obj =>
                  `Please provide a shorter sentence (${obj.value.length} / validationConfigs.learningOutcomes.sentenceLength.max)`,
              )
              .withMutation(s =>
                forPublish
                  ? s
                      .min(
                        validationConfigs.learningOutcomes.sentenceLength.min,
                        obj =>
                          `Please provide a longer sentence (${obj.value.length} < validationConfigs.learningOutcomes.sentenceLength.min)`,
                      )
                      .required('Please provide a sentence')
                  : s,
              ),
          }),
        )
        .withMutation(s =>
          forPublish
            ? s
                .min(
                  validationConfigs.learningOutcomes.amount.min,
                  `Please provide at least ${validationConfigs.learningOutcomes.amount.min} learning outcome`,
                )
                .max(
                  validationConfigs.learningOutcomes.amount.max,
                  `Please provide at most ${validationConfigs.learningOutcomes.amount.max} learning outcomes`,
                )
                .required(
                  `Please provide at least ${validationConfigs.learningOutcomes.amount.min} learning outcome`,
                )
            : s,
        )
        .default([]),
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
