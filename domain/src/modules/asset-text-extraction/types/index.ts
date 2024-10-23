import { d_u, date_time_string } from '@moodle/lib-types'

export type textExtractionWeight = 'title' | 'heading' | 'paragraph'

export type assetTextExtraction = {
  texts: {
    weight: textExtractionWeight
    body: string
  }[]
  extractionDate: string
  extractor: string
  extractionMethod: string
}

export type assetTextExtractionStatus = d_u<
  {
    extracted: {
      result: assetTextExtraction
    }
    requested: {
      date: date_time_string
    } & d_u<
      {
        enqueued: unknown
        ongoing: {
          startDate: date_time_string
        }
      },
      'extraction'
    >
  },
  'status'
>
