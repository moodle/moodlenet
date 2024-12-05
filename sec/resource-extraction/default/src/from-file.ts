import { tikaExtractAsset } from '@moodle/lib-asset-extraction-tika'
import { extractionOutcome } from '@moodle/module/resource-extraction'
import extensionSpecificExtractors from './fileExtensionSpecificExtractors'
import typeSpecificExtractor from './fileTypeSpecificExtractors'
import { assetExtractor } from './types'

export const extractTextFromFile: assetExtractor<'local'> = async ({ asset, env }) => {
  const ext = (asset.name.split('.').pop() ?? '').toLowerCase()

  const typeKind = (asset.mimetype.split('/').shift() ?? '').toLowerCase()

  const extractor =
    extensionSpecificExtractors[ext] ??
    typeSpecificExtractor[typeKind] ??
    (async (): Promise<extractionOutcome> => [false, { reason: 'noExtractorAvailable' }])

  return extractor({ asset, env })
    .catch<null>(() => null)
    .then(mOutcome => mOutcome ?? tikaExtractAsset({ asset, tikaUrl: env.tikaUrl }))
    .catch<extractionOutcome>(error => [false, { reason: 'error', error }])
}
