import { d_u, flags } from '@moodle/lib-types'
import { eduCollectionData } from '../../../../edu'

export type collectionCardData = {
  data: eduCollectionData
  id: string
} & d_u<
  {
    published: {
      stats: { numResources: number; numFollowers: number }
      slug: string
      flags: flags<'isAuthenticated' | 'isCreator'>
      links: flags<'bookmarked' | 'followed'>
    }

    draft: unknown
  },
  'status'
>
