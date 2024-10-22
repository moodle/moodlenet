import { d_u, date_time_string } from '@moodle/lib-types'

export type textExtractionWeight = 'title' | 'heading' | 'paragraph'

export type assetTextExtraction = {
  texts: {
    weight: textExtractionWeight
    body: string
  }[]
  extractedAt: string
  extractor: string
  extractionMethod: string
}

export type assetTextExtractionStatus = d_u<
  {
    extracted: {
      result: assetTextExtraction
    }
    requested: {
      at: date_time_string
    } & d_u<
      {
        enqueued: unknown
        ongoing: {
          startedAt: date_time_string
        }
      },
      'extraction'
    >
  },
  'status'
>
