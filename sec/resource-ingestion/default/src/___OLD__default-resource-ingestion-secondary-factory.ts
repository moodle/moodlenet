import { secondaryProvider } from '@moodle/domain'
import { getTempFileReadable } from '@moodle/lib-domain-fs'
import { unreachable_never } from '@moodle/lib-types'
import { ingestReadable } from './ingest-readable'
import { ingestExternalAsset } from './ingest-url'
import { defaultResourceIngestorEnv, ingestionObject } from './types'

export function get_default_resource_ingestion_secondary_factory(env: defaultResourceIngestorEnv): secondaryProvider {
  return secondaryContext => {
    return {
      resourceIngestion: {
        write: {
          async ingestResource({ asset /* , ingestionContext */ }) {
            try {
              const object: ingestionObject =
                asset.type === 'external'
                  ? { type: 'url', url: asset.url }
                  : asset.type === 'stored'
                    ? await (async asset => {
                        const [tmpAssetReferenceCreated, tmpAssetReferenceResult] =
                          await secondaryContext.mod.secondary.storage.service.createStoredAssetTempFileReference({
                            expiresSeconds: 300,
                            storedAssetMeta: asset,
                          })
                        if (!tmpAssetReferenceCreated) {
                          throw tmpAssetReferenceResult
                        }

                        const readable = await getTempFileReadable({
                          tempId: tmpAssetReferenceResult.tempId,
                          domainFsDirectories: secondaryContext.domainFsDirectories,
                        })

                        const ingestionObject: ingestionObject = {
                          type: 'readable',
                          readable,
                          mimetype: asset.mimetype,
                          name: asset.name,
                        }
                        return ingestionObject
                      })(asset)
                    : unreachable_never(asset)

              const eduResourceIngestionOutcome = await (object.type === 'readable'
                ? ingestReadable({ object, env })
                : object.type === 'url'
                  ? ingestExternalAsset({ object, env })
                  : unreachable_never(object))

              return {
                eduResourceIngestionOutcome: {
                  ...eduResourceIngestionOutcome,
                  ingestionImpl: `default_resource_ingestion_secondary: ${eduResourceIngestionOutcome.ingestionImpl}`,
                },
              }
            } catch (error) {
              return {
                eduResourceIngestionOutcome: {
                  outcome: 'undoable',
                  ingestionImpl: 'default_resource_ingestion_secondary',
                  details: { error },
                  reason: String(error),
                },
              }
            }
          },
        },
      },
    }
  }
}
