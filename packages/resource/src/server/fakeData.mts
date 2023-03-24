import { ResourceFormValues, ResourceTypeForm } from '../common.mjs'

export const resourceFormValues: ResourceFormValues = {
  content: '',
  description:
    'Earth 2020: An Insider’s Guide to a Rapidly Changing Planet responds to a public increasingly concerned about the deterioration of Earth’s natural systems, offering readers a wealth of perspectives on our shared ecological past, and on the future trajectory of planet Earth. Written by world-leading thinkers on the front-lines of global change research and policy, this multi-disciplinary collection maintains a dual focus: some essays investigate specific facets of the physical Earth system, while others explore the social, legal and political dimensions shaping the human environmental footprint. In doing so, the essays collectively highlight the urgent need for collaboration across diverse domains of expertise in addressing one of the most significant challenges facing us today. Earth 2020 is essential reading for everyone seeking a deeper understanding of the past, present and future of our planet, and the role of humanity in shaping this trajectory.',
  image: 'https://picsum.photos/200/100',
  name: 'The Best Resource Ever',
}

export const resFakeData: ResourceTypeForm = {
  data: {
    id: 'aaa123',
    mnUrl: 'http:www.ggg.it',
    numLikes: 0,
    isPublished: true,
    contentUrl: 'http:www.ggg.it',
    specificContentType: 'Video',
    contentType: 'link',
    downloadFilename: 'resf.pdf',
  },
  state: {
    liked: false,
    bookmarked: false,
  },
  authFlags: {
    isAuthenticated: true,
    isCreator: true,
    isAdmin: true,
    canEdit: true,
  },
  resourceForm: resourceFormValues,
  contributor: {
    avatarUrl: null,
    displayName: '',
    timeSinceCreation: '',
    creatorProfileHref: { ext: false, url: '' },
  },
}

export const resFakes: ResourceTypeForm[] = [resFakeData]
export const resFake: ResourceTypeForm = resFakes[0] || resFakeData
