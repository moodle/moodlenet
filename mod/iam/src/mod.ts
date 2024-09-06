import { mod } from '@moodle/domain'
declare module '@moodle/domain' {
  export interface MoodleMods {
    iam: moodle_iam_mod
  }
}

export type moodle_iam_mod = mod<{
  V0_1: {
    pri: never
    sec: never
    evt: never
  }
}>
