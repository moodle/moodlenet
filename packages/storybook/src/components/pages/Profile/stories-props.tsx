import { overrideDeep } from '@moodlenet/component-library/common'
import { OverallCardStories } from '@moodlenet/react-app/stories'
import { MainProfileCardSlots, OverallCard, ProfileProps } from '@moodlenet/react-app/ui'
import { PartialDeep } from 'type-fest'

// const editForm: ProfileFormValues = {
//   displayName: 'Alberto Curcella',
//   description: '',
//   avatarImage:
//     'https://moodle.net/assets/01F/T/N/3/X/3CGXZ0TQRN1EX27D7WY/01FTN3X3CGXZ0TQRN1EX27D7WY.jpg',
//   backgroundImage:
//     'https://images.unsplash.com/photo-1450045439515-ff27c2f2e6b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDQ5NjR8MHwxfHNlYXJjaHw1fHx3aGFsZXxlbnwwfDB8fHwxNjU0NzU2NzU3&ixlib=rb-1.2.1&q=80&w=1080',
//   location: 'San Felipe, Mexico',
//   organizationName: 'Moodle Pty Ltd',
//   siteUrl: 'https://moodle.com',
// }

import {
  fileExceedsMaxUploadSize,
  peopleFactory,
  randomIntFromInterval,
} from '@moodlenet/component-library'
import { ProfileAccess, ProfileActions, ProfileFormValues } from '@moodlenet/react-app/common'
import { action } from '@storybook/addon-actions'
import { mixed, object, SchemaOf, string } from 'yup'
import { MainLayoutLoggedInStoryProps } from '../../layout/MainLayout/MainLayout.stories.js'

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

export const useProfileStoryProps = (overrides?: PartialDeep<ProfileProps>): ProfileProps => {
  const person = peopleFactory[randomIntFromInterval(0, 3)]

  const overallCard = {
    Item: () => <OverallCard {...OverallCardStories.OverallCardStoryProps} />,
    key: 'overall-card',
  }

  const profileCardSlots: MainProfileCardSlots = {
    topItems: [],
    mainColumnItems: [],
    titleItems: [],
    subtitleItems: [],
    footerItems: [],
  }

  // const state: ProfileState = {
  //   followed: false,
  // }

  const actions: ProfileActions = {
    editProfile: async () => action('editing profile'),
    toggleFollow: action('toggle follow'),
  }

  const access: ProfileAccess = {
    isAuthenticated: true,
    canEdit: false,
    isCreator: false,
    isAdmin: false,
  }

  const profileForm: ProfileFormValues = {
    displayName: person ? person.displayName : '',
    aboutMe:
      'Italian biologist specialized in endangered rainforest monitoring. Cooperating with local organizations to improve nature reserves politics.',
    organizationName: person && person.organization,
    location: person && person.location,
    siteUrl: 'https://iuri.is/',
    avatarImage: person && person.avatarUrl,
    backgroundImage: person && person.backgroundUrl,
  }

  return overrideDeep<ProfileProps>(
    {
      mainLayoutProps: MainLayoutLoggedInStoryProps,
      sideColumnItems: [overallCard],
      mainProfileCardSlots: profileCardSlots,
      profileForm: profileForm,
      // state: state,
      actions: actions,
      access: access,
      validationSchema: profileStoriesValidationSchema,

      // editForm: ProfileCardStoryProps.editForm,
      // sendEmailForm: useFormik<{ text: string }>({
      //   initialValues: { text: '' },
      //   onSubmit: action('submit send Email Form'),
      // }),
      // reportForm: useFormik<{ comment: string }>({
      //   initialValues: { comment: '' },
      //   onSubmit: action('submit report Form'),
      // }),
      // newResourceHref: href('Pages/New Resource/Default'),
      // newCollectionHref: href('Pages/New Collection/Start'),
      // headerPageTemplateProps: {
      //   headerPageProps: HeaderPageLoggedInStoryProps,
      //   isAuthenticated,
      //   mainPageWrapperProps: {
      //     userAcceptsPolicies: null,
      //     cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
      //   },
      // },
      // overallCardProps: OverallCardStoryProps,
      // collectionCardPropsList: [
      //   CollectionCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
      //   CollectionCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
      // ],
      // resourceCardPropsList: [
      //   ResourceCardLoggedInStoryProps,
      //   ResourceCardLoggedInStoryProps,
      //   ResourceCardLoggedInStoryProps,
      // ],
    },
    { ...overrides },
  )
}
