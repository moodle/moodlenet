import { core_factory } from '../../../types'

export function core(): core_factory {
  return ({ worker }) => {
    const mysec = worker.moodle.eml_pwd_auth.V0_1.sec
    return {
      moodle: {
        eml_pwd_auth: {
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
