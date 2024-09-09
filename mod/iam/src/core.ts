import { core_factory, module_process } from '@moodle/domain'

export function core(): core_factory {
  return ctx => {
    return {
      moodle: {
        iam: {
          v0_1: {
            pri: {
              configs: {
                read() {
                  return ctx.worker.moodle.iam.v0_1.sec.db.getConfigs()
                },
              },
            },
          },
        },
      },
    }
  }
}

export const process: module_process = ctx => {
  // setTimeout(getinactiveUsers ....)
}
