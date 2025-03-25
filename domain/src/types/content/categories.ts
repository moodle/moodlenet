/* eslint-disable @typescript-eslint/no-namespace */
import { fract, url_string } from '@moodle/lib-types'
declare global {
  namespace moo {
    namespace def.content {
      namespace categories {
        type credits = {
          owner: { name: string; url: url_string }
          provider?: { name: string; url: url_string }
        }

        type language = {
          code: string
          part2b: string | null
          part2t: string | null
          part1: string | null
          scope: string
          type: string
          name: string
        }

        type license = {
          code: string
          name: string
          restrictiveness: fract
        }
      }
    }
  }
}
