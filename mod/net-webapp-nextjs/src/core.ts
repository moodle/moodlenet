import { core_factory } from '@moodle/domain'

export function core(): core_factory {
  return ({ worker }) => {
    return {
      moodle: {
        netWebappNextjs: {
          v0_1: {
            pri: {
              configs: {
                async read() {
                  return worker.moodle.netWebappNextjs.v0_1.sec.db.getConfigs()
                },
              },
            },
          },
        },
      },
    }
  }
}
