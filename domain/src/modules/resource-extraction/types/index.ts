import { d_u, date_time_string, ok_ko } from '@moodle/lib-types'
import { asset } from '../../storage'

// export type resourceExtractionMetadata = {
//   extractor: string
//   extractionMethod: string
//   title: string | null
//   rawText: string
//   inferredLanguageCode: null | contentLanguageCode
//   keywords: string[] | null
//   paragraphs: {
//     heading: string | null
//     body: string
//   }[]
// }
export type resourceExtractionStatus = d_u<
  {
    // neverStarted: unknown
    enqueued: resourceExtractionEnqueued
    ongoing: resourceExtractionStarted
    extracted: resourceExtractionEnded & { result: resourceExtractionResult[] }
    error: resourceExtractionEnded & { message: string; debug: unknown }
  },
  'status'
>

type resourceExtractionEnqueued = {
  attempt: number
  enqueueDate: date_time_string
}
type resourceExtractionStarted = resourceExtractionEnqueued & {
  startDate: date_time_string
}
type resourceExtractionEnded = resourceExtractionStarted & {
  endDate: date_time_string
}

export type resourceExtractionResult = {
  title: null | string
  content: null | string
  image: null | asset
  extractionKind: string
}

export type extractionOutcome = ok_ko<
  resourceExtractionResult,
  {
    noExtractorAvailable: unknown
    couldNotExtract: unknown
    error: { error?: unknown }
  }
>
