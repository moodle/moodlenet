// import { t } from '@lingui/macro'
import { overrideDeep } from '@moodlenet/component-library/common'
import { action } from '@storybook/addon-actions'
import { useFormik } from 'formik'
import { PartialDeep } from 'type-fest'
import { mixed, object, SchemaOf, string } from 'yup'
import { ProfileFormValues } from '../../../../../common/types.mjs'
import { people } from '../../../helpers/factories.js'
import { fileExceedsMaxUploadSize, randomIntFromInterval } from '../../../helpers/utilities.js'
import { MainProfileCardProps } from './MainProfileCard.js'
// import { people } from '../../../../../helpers/factories'
// import { fileExceedsMaxUploadSize, people, randomIntFromInterval } from '@moodlenet/component-library/ui.mjs'

const maxUploadSize = 1024 * 1024 * 50
export const profileStoriesValidationSchema: SchemaOf<ProfileFormValues> = object({
  avatarImage: mixed()
    .test((v, { createError }) =>
      v instanceof Blob && fileExceedsMaxUploadSize(v.size, maxUploadSize)
        ? createError({
            message: /* t */ `The image is too big, reduce the size or use another image`,
          })
        : true,
    )
    .optional(),
  backgroundImage: mixed()
    .test((v, { createError }) =>
      v instanceof Blob && fileExceedsMaxUploadSize(v.size, maxUploadSize)
        ? createError({
            message: /* t */ `The image is too big, reduce the size or use another image`,
          })
        : true,
    )
    .optional(),
  displayName: string().max(160).min(3).required(/* t */ `Please provide a display name`),
  location: string().optional(),
  organizationName: string().max(30).min(3).optional(),
  siteUrl: string().url().optional(),
  aboutMe: string().max(4096).min(3).required(/* t */ `Please provide a description`),
})

export const useMainProfileCardStoryProps = (
  overrides?: PartialDeep<MainProfileCardProps>,
): MainProfileCardProps => {
  const person = people[randomIntFromInterval(0, 3)]
  return overrideDeep<MainProfileCardProps>(
    {
      slots: {
        mainColumnItems: [],
        topItems: [],
        titleItems: [],
        subtitleItems: [],
        footerItems: [],
      },
      isEditing: false,
      toggleIsEditing: action('toggle Is Editing'),
      sendMessage: action('send message'),
      profileUrl: 'https://iuri.is/',
      // state: {
      //   followed: false,
      // },
      // actions: {
      //   editProfile: action('edit profile'),
      //   toggleFollow: action('toogle is following'),
      // },
      access: {
        isAdmin: false,
        isCreator: false,
        isAuthenticated: false,
        canEdit: false,
      },
      form: useFormik<ProfileFormValues>({
        onSubmit: action('submit edit'),
        validationSchema: profileStoriesValidationSchema,
        initialValues: {
          displayName: person ? person.title : '',
          aboutMe:
            'Italian biologist specialized in endangered rainforest monitoring. Cooperating with local organizations to improve nature reserves politics.',
          organizationName: person && person.organization,
          location: person && person.location,
          siteUrl: 'https://iuri.is/',
          avatarImage: person && person.avatarUrl,
          backgroundImage: person && person.backgroundUrl,
          ...overrides?.form,
        },
      }),
    },
    overrides,
  )
}
