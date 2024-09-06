import { core_factory } from '@moodle/domain'

export function core(): core_factory {
  return ({ worker }) => {
    const mysec = worker.moodle.net.V0_1.sec
    return {
      moodle: {
        net: {
          V0_1: {
            pri: {
              read: {
                async configs() {
                  return mysec.read.configs()
                },
              },
            },
          },
        },
      },
    }
  }
}
