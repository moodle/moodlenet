/* eslint-disable @typescript-eslint/no-namespace */
import { fileMeta } from '@moodle/lib-domain-fs'
import { d_u, d_u__d, url_string } from '@moodle/lib-types'

declare global {
  namespace moo {
    namespace content {
      type asset = d_u<
        {
          stored: fileMeta
          external: asset.external
        },
        'type'
      >
      namespace asset {
        type external = { url: url_string; credits?: moo.content.categories.credits }

        type maybe = asset | none
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

        type adoptResult<typ extends maybe['type'] = maybe['type']> = d_u<
          {
            assetSubmitted: unknown
            done: { asset: d_u__d<maybe, 'type', typ> }
            error: { message?: string }
          },
          'status'
        >

        type adoptService<accepts extends adoptForm['type'] = adoptForm['type']> = (
          adoptAssetForm: d_u__d<adoptForm, 'type', accepts>,
        ) => Promise<adoptResult>
      }
    }
  }
}
