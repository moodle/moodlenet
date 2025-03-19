/* eslint-disable @typescript-eslint/no-namespace */
import { d_u, d_u__d, date_time_string, mimetype, url_string } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { Error4xx } from '../../lib/access-error'

declare global {
  namespace moo.def.content {
    type fileMeta = {
      name: string
      size: number
      mimetype: mimetype
      uploaded: null | {
        date: date_time_string
        by: moo.def.policies.user.info.user
      }
    }
    type asset = d_u<
      {
        stored: { fileMeta: fileMeta }
        external: asset.external
      },
      'type'
    >
    namespace asset {
      type external = { url: url_string; credits?: moo.def.content.categories.credits }

      type optional = asset | none
      type none = d_u<{ none: unknown }, 'type'>

      type adoptForm = d_u<
        {
          tempFile: {
            tempId: string
          }
          external: external
          none: unknown
        },
        'type'
      >

      type adoptResult<typ extends optional['type'] = optional['type']> = Either<
        Error4xx,
        d_u<
          {
            assetSubmitted: unknown
            done: { asset: d_u__d<optional, 'type', typ> }
          },
          'status'
        >
      >

      type adoptModel<accepts extends adoptForm['type'] = adoptForm['type']> = (adoptAssetForm: d_u__d<adoptForm, 'type', accepts>) => Promise<adoptResult>
    }
  }
  }

