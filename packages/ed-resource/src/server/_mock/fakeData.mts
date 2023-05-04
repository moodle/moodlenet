import type { ResourceFormRpc, ResourceRpc } from '../../common/types.mjs'

export const resourceFormValues: ResourceFormRpc = {
  description:
    'Earth 2020: An Insider’s Guide to a Rapidly Changing Planet responds to a public increasingly concerned about the deterioration of Earth’s natural systems, offering readers a wealth of perspectives on our shared ecological past, and on the future trajectory of planet Earth. Written by world-leading thinkers on the front-lines of global change research and policy, this multi-disciplinary resource maintains a dual focus: some essays investigate specific facets of the physical Earth system, while others explore the social, legal and political dimensions shaping the human environmental footprint. In doing so, the essays collectively highlight the urgent need for collaboration across diverse domains of expertise in addressing one of the most significant challenges facing us today. Earth 2020 is essential reading for everyone seeking a deeper understanding of the past, present and future of our planet, and the role of humanity in shaping this trajectory.',
  title: 'The Best Resource Ever',
  license: '', //@ETTO to be filled
  subject: '', //@ETTO to be filled
  language: '', //@ETTO to be filled
  level: '', //@ETTO to be filled
  month: '', //@ETTO to be filled
  year: '', //@ETTO to be filled
  type: '', //@ETTO to be filled
}

export const resFakeData: ResourceRpc = {
  data: {
    resourceId: 'aaa123',
    mnUrl: 'http:www.ggg.it',
    contentUrl: 'http:www.ggg.it',
    contentType: 'link',
    downloadFilename: 'resf.pdf',
    imageUrl: 'https://picsum.photos/200/100',

    // numLikes: 0,
  },
  state: {
    isPublished: true,
  },
  access: {
    isCreator: true,
    canPublish: true,
    canDelete: true,
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

export const resFakes: ResourceRpc[] = [resFakeData]
export const resFake: ResourceRpc = resFakes[0] || resFakeData
