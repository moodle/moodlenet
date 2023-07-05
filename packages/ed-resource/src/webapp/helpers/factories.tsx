import { href } from '@moodlenet/react-app/common'
import type { PartialDeep } from 'type-fest'
import type { ResourceCardProps } from '../components/organisms/ResourceCard/ResourceCard.js'

export const resourcesCardFactory: PartialDeep<ResourceCardProps>[] = [
  {
    access: {
      // canLike: false,
      // isCreator: true,
      canDelete: true,
      canPublish: true,
    },
    data: {
      title: 'Why the oceans are so important',
      owner: {
        displayName: 'Juanito Rodriguez',
        avatar:
          'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        profileHref: href('Pages/Profile'),
      },
      image: {
        location:
          'https://images.unsplash.com/photo-1604060215504-0954788ee762?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      },
    },
  },
  {
    access: {
      // canLike: false,
      // isCreator: true,
      canDelete: true,
      canPublish: true,
    },
    data: {
      title: 'How ecosystems collapse',
      owner: {
        displayName: 'Finaritra Randevoson',
        avatar:
          'https://images.unsplash.com/photo-1586351012965-861624544334?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        profileHref: href('Pages/Profile'),
      },
      image: {
        location:
          'https://images.unsplash.com/photo-1621451651659-ac1c3100a9b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
      },
    },
  },
  {
    access: {
      // canLike: false,
      // isCreator: true,
      canDelete: true,
      canPublish: true,
    },
    data: {
      title: 'The true role of CO2',
      owner: {
        displayName: 'Alberto Curcella',
        avatar:
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        profileHref: href('Pages/Profile'),
      },
      image: {
        location:
          'https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80',
      },
    },
  },
  {
    access: {
      // canLike: false,
      // isCreator: true,
      canDelete: true,
      canPublish: true,
    },
    data: {
      title: 'Fullfilling life with little needs',
      owner: {
        displayName: 'Katy Greentree',
        avatar:
          'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
        profileHref: href('Pages/Profile'),
      },
      image: {
        location:
          'https://images.unsplash.com/photo-1575996531329-2c400bbd91e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      },
    },
  },
  {
    access: {
      // canLike: false,
      // isCreator: true,
      canDelete: true,
      canPublish: true,
    },
    data: {
      title: 'How black holes collapse',
      owner: {
        displayName: 'Cristina Forat',
        avatar:
          'https://images.unsplash.com/photo-1574838163272-16992518d74c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1208&q=80',
        profileHref: href('Pages/Profile'),
      },
      image: {
        location:
          'https://media.wired.com/photos/59d3ac76dfe65f09d639f81a/2:1/w_2400,h_1200,c_limit/ligoHP.jpg',
      },
    },
  },
]
