import { d_u, date_time_string } from '@moodle/lib-types'

export type textExtractionResult = {
  title: string
  keywords: string[]
  paragraphs: {
    heading: string
    body: string
  }[]
}

export type textExtractionStatus = d_u<
  {
    neverStarted: unknown
    enqueued: textExtractionEnqueued
    ongoing: textExtractionStarted
    extracted: textExtractionEnded & { result: textExtractionResult }
    error: textExtractionEnded & { message: string; debug: unknown }
  },
  'status'
>

type textExtractionEnqueued = {
  enqueueDate: date_time_string
}
type textExtractionStarted = textExtractionEnqueued & {
  startDate: date_time_string
  extractor: string
  extractionMethod: string
}
type textExtractionEnded = textExtractionStarted & {
  endDate: date_time_string
}
