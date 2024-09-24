// import { t } from '@lingui/macro'
import { overrideDeep } from '@moodlenet/component-library/common'
import { href } from '@moodlenet/react-app/common'
import { fileExceedsMaxUploadSize, randomIntFromInterval } from '@moodlenet/react-app/ui'
import { getValidationSchemas, type ProfileFormValues } from '@moodlenet/web-user/common'
import type { MainProfileCardProps } from '@moodlenet/web-user/ui'
import { people } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'
import { useFormik } from 'formik'
import type { PartialDeep } from 'type-fest'
import type { SchemaOf } from 'yup'
import { mixed, object, string } from 'yup'
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
  location: string()
    .transform(value => value || null)
    .nullable(),
  organizationName: string()
    .max(30)
    .min(3)
    .transform(value => value || null)
    .nullable(),
  siteUrl: string()
    .url()
    .transform(value => value || null)
    .nullable(),
  aboutMe: string().max(4096).min(3).required(/* t */ `Please provide a description`),
})

export default function useMainProfileCardStoryProps(
  overrides?: PartialDeep<MainProfileCardProps>,
): MainProfileCardProps {
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

      profileUrl: 'https://iuri.is/',

      actions: {
        sendMessage: action('send message'),
        setAvatar: action('set avatar image'),
        setBackground: action('set background image'),
        editProfile: action('edit profile'),
        toggleFollow: action('toogle is following'),
        approveUser: action('approve user'),
        unapproveUser: action('unapprove user'),
      },
      access: {
        isAdmin: false,
        isCreator: false,
        isAuthenticated: true,
        canEdit: false,
        canFollow: true,
        canApprove: false,
        isPublisher: true,
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
          ...overrides?.form,
        },
      }),
      state: {
        followed: false,
        numFollowers: 12,
        profileUrl: 'https://iuri.is/',
        isPublisher: true,
        showAccountApprovedSuccessAlert: false,
        ...overrides?.state,
      },
      data: {
        avatarUrl: person && person.avatarUrl,
        backgroundUrl: person && person.backgroundUrl,
        userId: (Math.random() * 1000000).toString(),
        displayName: person && person.username ? person.username : 'username',
        points: 1000,
        ...overrides?.data,
        profileHref: href('https://iuri.is/'),
      },
      validationSchemas: getValidationSchemas({ imageMaxUploadSize: maxUploadSize }),
    },
    overrides,
  )
}
