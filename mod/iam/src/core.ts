import { core_factory } from '@moodle/domain'

export function core(): core_factory {
  return ctx => {
    return {
      moodle: {
        iam: {
          V0_1: {},
        },
      },
    }
  }
}
