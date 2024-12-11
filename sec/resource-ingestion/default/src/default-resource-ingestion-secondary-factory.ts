import { secondaryProvider } from '@moodle/domain'
import { defaultResourceIngestorEnv, ingestionObject } from './types'
import { unreachable_never } from '@moodle/lib-types'
import { createStoredAssetTempReadable } from '@moodle/module/storage/lib'
import { ingestExternalAsset } from './ingest-url'
import { ingestReadable } from './ingest-readable'

export function get_default_resource_ingestion_secondary_factory(env: defaultResourceIngestorEnv): secondaryProvider {
  return secondaryContext => {
    return {
      resourceIngestion: {
        service: {
          async ingestResource({ asset /* , ingestionContext */ }) {
            try {
              const object: ingestionObject =
                asset.type === 'external'
                  ? { type: 'url', url: asset.url }
                  : asset.type === 'stored'
                    ? await (async asset => {
                        const [storedAssetTempReadableCreated, storedAssetTempReadableResult] =
                          await createStoredAssetTempReadable({
                            expiresSeconds: 300,
                            storedAssetMeta: asset,
                            secondaryContext,
                          })
                        if (!storedAssetTempReadableCreated) {
                          throw storedAssetTempReadableResult
                        }
                        const ingestionObject: ingestionObject = {
                          type: 'readable',
                          readable: storedAssetTempReadableResult.readable,
                          mimetype: asset.mimetype,
                          name: asset.name,
                        }
                        return ingestionObject
                      })(asset)
                    : unreachable_never(asset)

              return object.type === 'readable'
                ? ingestReadable({ object, env })
                : object.type === 'url'
                  ? ingestExternalAsset({ object, env })
                  : unreachable_never(object)
            } catch (error) {
              return { outcome: 'failed', reason: { error } }
            }
          },
        },
      },
    }
  }
}
