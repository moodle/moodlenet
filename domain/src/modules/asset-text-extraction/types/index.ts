import { d_u, date_time_string } from '@moodle/lib-types'
import { contentLanguageCode } from '../../content'

export type textExtractionMetadata = {
  extractor: string
  extractionMethod: string
  title: string | null
  rawText: string
  inferredLanguageCode: null | contentLanguageCode
  keywords: string[] | null
  paragraphs: {
    heading: string | null
    body: string
  }[]
}
export type textExtractionStatus = d_u<
  {
    // neverStarted: unknown
    enqueued: textExtractionEnqueued
    ongoing: textExtractionStarted
    extracted: textExtractionEnded & { result: textExtractionMetadata[] }
    error: textExtractionEnded & { message: string; debug: unknown }
  },
  'status'
>

type textExtractionEnqueued = {
  attempt: number
  enqueueDate: date_time_string
}
type textExtractionStarted = textExtractionEnqueued & {
  startDate: date_time_string

}
type textExtractionEnded = textExtractionStarted & {
  endDate: date_time_string
}
