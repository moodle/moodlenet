import { ComponentMeta, ComponentStory } from '@storybook/react'
import { getProfileCardStoryProps } from '../../organisms/ProfileCard/stories-props.js'
import Profile from './Profile.js'
import { getProfileStoryProps } from './stories-props.js'
// import { href } from '../../../elements/link'

const meta: ComponentMeta<typeof Profile> = {
  title: 'Pages/Profile',
  component: Profile,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'ProfileLoggedOutStoryProps',
    'ProfileLoggedInStoryProps',
    'ProfileOwnerStoryProps',
    'ProfileActivatedStoryProps',
    'ProfileAdminStoryProps',
    'ProfileApprovedStoryProps',
  ],
}

type ProfileStory = ComponentStory<typeof Profile>

export const LoggedOut: ProfileStory = () => {
  const props = getProfileStoryProps()
  //     {
  //     isAuthenticated: false,
  //     props: {
  //       headerPageTemplateProps: {
  //         isAuthenticated: false,
  //         headerPageProps: {
  //           // isAuthenticated: false,
  //           headerProps: {
  //             ...HeaderLoggedOutStoryProps,
  //             me: null,
  //           },
  //           // subHeaderProps: {
  //           //   tags: [],
  //           // },
  //         },
  //         mainPageWrapperProps: {
  //           userAcceptsPolicies: null,
  //           cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
  //         },
  //       },
  //       collectionCardPropsList: [
  //         CollectionCardLoggedOutStoryProps(
  //           randomIntFromInterval(0, 1) === 0 ? 0 : 1
  //         ),
  //         CollectionCardLoggedOutStoryProps(
  //           randomIntFromInterval(0, 1) === 0 ? 0 : 1
  //         ),
  //         CollectionCardLoggedOutStoryProps(
  //           randomIntFromInterval(0, 1) === 0 ? 0 : 1
  //         ),
  //       ],
  //       resourceCardPropsList: [
  //         ResourceCardLoggedOutStoryProps(
  //           randomIntFromInterval(0, 1) === 0 ? 0 : 1
  //         ),
  //         ResourceCardLoggedOutStoryProps(
  //           randomIntFromInterval(0, 1) === 0 ? 0 : 1
  //         ),
  //       ],
  //     },
  //   }
  //   )

  return <Profile {...props} />
}

export const LoggedIn: ProfileStory = () => {
  const props = getProfileStoryProps({
    props: {
      profileCardProps: getProfileCardStoryProps({
        props: { isAuthenticated: true },
      }),
    },
  })
  return <Profile {...props} />
}

export const Owner: ProfileStory = () => {
  const props = getProfileStoryProps({
    props: {
      profileCardProps: getProfileCardStoryProps(
        { props: { isOwner: true } },

        //   collectionCardPropsList: [
        //     CollectionCardOwnerPrivateStoryProps(
        //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
        //     ),
        //     CollectionCardOwnerStoryProps(
        //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
        //     ),
        //     CollectionCardOwnerStoryProps(
        //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
        //     ),
        //     CollectionCardOwnerPrivateStoryProps(
        //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
        //     ),
        //   ],
        //   resourceCardPropsList: [
        //     ResourceCardOwnerPrivateStoryProps,
        //     ResourceCardOwnerStoryProps,
        //     ResourceCardOwnerStoryProps,
        //     ResourceCardOwnerPrivateStoryProps,
        //     ResourceCardOwnerStoryProps,
        //   ],
      ),
    },
  })
  return <Profile {...props} />
}
export const Editting: ProfileStory = () => {
  const props = getProfileStoryProps({
    props: {
      profileCardProps: getProfileCardStoryProps(
        { props: { isOwner: true, isEditing: true } },

        //   collectionCardPropsList: [
        //     CollectionCardOwnerPrivateStoryProps(
        //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
        //     ),
        //     CollectionCardOwnerStoryProps(
        //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
        //     ),
        //     CollectionCardOwnerStoryProps(
        //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
        //     ),
        //     CollectionCardOwnerPrivateStoryProps(
        //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
        //     ),
        //   ],
        //   resourceCardPropsList: [
        //     ResourceCardOwnerPrivateStoryProps,
        //     ResourceCardOwnerStoryProps,
        //     ResourceCardOwnerStoryProps,
        //     ResourceCardOwnerPrivateStoryProps,
        //     ResourceCardOwnerStoryProps,
        //   ],
      ),
    },
  })
  return <Profile {...props} />
}

export const Approved: ProfileStory = () => {
  const props = getProfileStoryProps({
    props: {
      profileCardProps: getProfileCardStoryProps({
        props: { isOwner: true, isApproved: true },
      }),
      //   collectionCardPropsList: [
      //     CollectionCardOwnerPrivateStoryProps(
      //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
      //     ),
      //     CollectionCardOwnerStoryProps(
      //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
      //     ),
      //     CollectionCardOwnerStoryProps(
      //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
      //     ),
      //     CollectionCardOwnerPrivateStoryProps(
      //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
      //     ),
      //   ],
      //   resourceCardPropsList: [
      //     ResourceCardOwnerPrivateStoryProps,
      //     ResourceCardOwnerStoryProps,
      //     ResourceCardOwnerStoryProps,
      //     ResourceCardOwnerPrivateStoryProps,
      //     ResourceCardOwnerStoryProps,
      //   ],
      //   showAccountApprovedSuccessAlert: true,
    },
  })
  return <Profile {...props} />
}

export const Activated: ProfileStory = () => {
  const props = getProfileStoryProps({
    // editFormValues: {
    //   description: '',
    //   location: '',
    //   avatarImage: null,
    //   backgroundImage: null,
    //   organizationName: '',
    //   siteUrl: '',
    // },
    // props: {
    //   //   collectionCardPropsList: [],
    //   //   resourceCardPropsList: [],
    //   showAccountCreationSuccessAlert: true,
    //   getProfileCardProps: usegetProfileCardStoryProps({
    //     props: {
    //       isAuthenticated: true,
    //       isOwner: true,
    //     },
    //   }),
    // },
  })
  return <Profile {...props} />
}

export const Admin: ProfileStory = () => {
  const props = getProfileStoryProps({
    // props: {
    //   getProfileCardProps: usegetProfileCardStoryProps({
    //     props: {
    //       isAdmin: true,
    //       isAuthenticated: true,
    //       isApproved: false,
    //     },
    //   }),
    //   collectionCardPropsList: [],
    //   resourceCardPropsList: [],
    //   showAccountApprovedSuccessAlert: true,
    // },
  })
  return <Profile {...props} />
}

export default meta
