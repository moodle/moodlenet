import { core_factory } from '@moodle/domain'

export function core(): core_factory {
  return ctx => {
    return {
      moodle: {
        iam: {
          v0_1: {
            pri: {
              configs: {
                read() {
                  return ctx.worker.moodle.iam.v0_1.sec.db_read.configs()
                },
              },
            },
          },
        },
      },
    }
  }
}
