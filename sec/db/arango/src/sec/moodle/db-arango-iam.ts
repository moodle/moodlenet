import { sec_factory } from '@moodle/domain'
import { db_struct_0_1 } from '../../dbStructure/0_1'

export function iam({ db_struct_0_1 }: { db_struct_0_1: db_struct_0_1 }): sec_factory {
  return ctx => {
    return {
      moodle: {
        iam: {},
      },
    }
  }
}
