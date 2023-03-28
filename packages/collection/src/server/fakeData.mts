import { href } from '@moodlenet/react-app/ui'
import { CollectionContributorCardProps } from '../common/types.mjs'

export const collectionFormValues = {
  description:
    'Earth 2020: An Insider’s Guide to a Rapidly Changing Planet responds to a public increasingly concerned about the deterioration of Earth’s natural systems, offering readers a wealth of perspectives on our shared ecological past, and on the future trajectory of planet Earth. Written by world-leading thinkers on the front-lines of global change research and policy, this multi-disciplinary collection maintains a dual focus: some essays investigate specific facets of the physical Earth system, while others explore the social, legal and political dimensions shaping the human environmental footprint. In doing so, the essays collectively highlight the urgent need for collaboration across diverse domains of expertise in addressing one of the most significant challenges facing us today. Earth 2020 is essential reading for everyone seeking a deeper understanding of the past, present and future of our planet, and the role of humanity in shaping this trajectory.',
  image: 'https://picsum.photos/200/100',
  name: 'The Best Collection Ever',
}

export const contributor: CollectionContributorCardProps = {
  avatarUrl:
    'https://images.pexels.com/photos/3746326/pexels-photo-3746326.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200',
  displayName: 'Juanita Rodriguez',
  creatorProfileHref: href('Pages/Profile/Logged In'),
}

export const resFakeData = {
  data: {
    id: 'aaa123',
    mnUrl: 'http:www.ggg.it',
    numFollowers: 0,
    isPublished: true,
    isWaitingForApproval: false,
  },
  form: collectionFormValues,
  state: {
    followed: true,
    bookmarked: true,
    isSaving: false,
    isSaved: false,
  },
  access: {
    isAuthenticated: true,
    isCreator: true,
    isAdmin: true,
    canEdit: true,
  },
  contributor,
}
