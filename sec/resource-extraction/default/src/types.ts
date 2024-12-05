import { d_u__d } from '@moodle/lib-types'
import { extractionOutcome } from '@moodle/module/resource-extraction'
import { accessibleAsset } from '@moodle/module/storage'

export type env = {
  tikaUrl: string
}

export type assetExtractor<type extends accessibleAsset['type'] = accessibleAsset['type']> = (fileExtractorArgs: {
  asset: d_u__d<accessibleAsset, 'type', type>
  env: env
}) => Promise<extractionOutcome>
