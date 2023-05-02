import { CollectionContributorRpc, CollectionRpc } from '../../common/types.mjs'

export const collectionFormValues = {
  description:
    'Earth 2020: An Insider’s Guide to a Rapidly Changing Planet responds to a public increasingly concerned about the deterioration of Earth’s natural systems, offering readers a wealth of perspectives on our shared ecological past, and on the future trajectory of planet Earth. Written by world-leading thinkers on the front-lines of global change research and policy, this multi-disciplinary collection maintains a dual focus: some essays investigate specific facets of the physical Earth system, while others explore the social, legal and political dimensions shaping the human environmental footprint. In doing so, the essays collectively highlight the urgent need for collaboration across diverse domains of expertise in addressing one of the most significant challenges facing us today. Earth 2020 is essential reading for everyone seeking a deeper understanding of the past, present and future of our planet, and the role of humanity in shaping this trajectory.',
  title: 'The Best Collection Ever',
}

export const contributor: CollectionContributorRpc = {
  avatarUrl:
    'https://images.pexels.com/photos/3746326/pexels-photo-3746326.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200',
  displayName: 'Juanita Rodriguez',
  creatorProfileHref: { url: 'Pages/Profile/Logged In', ext: false },
}

export const resFakeData: CollectionRpc = {
  data: {
    collectionId: 'aaa123',
    mnUrl: 'http:www.ggg.it',
    imageUrl: 'https://picsum.photos/200/100',
    isWaitingForApproval: false,
  },
  form: collectionFormValues,
  state: {
    isPublished: true,
    followed: false,
    numResources: 23,
    numFollowers: 12,
    bookmarked: false,
  },
  access: {
    isCreator: true,
    canPublish: true,
    canEdit: true,
    canDelete: true,
    canFollow: true,
    canBookmark: true,
    isAuthenticated: true,
  },
  contributor,
}
