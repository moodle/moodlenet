import type * as iam from '@moodle/mod-iam/types'
import type * as net from '@moodle/mod-net/types'
import type * as org from '@moodle/mod-org/types'
import type { Configs, Layouts } from './types'

import { DeploymentInfo } from '@moodle/lib-ddd'

declare module '@moodle/lib-ddd' {
  export interface Domain {
    primary: {
      'v5.0': {
        moodle: {
          netWebappNextjs: {
            schemaConfigs: {
              iam(): Promise<{ iamSchemaConfigs: iam.IamPrimaryMsgSchemaConfigs }>
              moodleNet(): Promise<{ moodleNetSchemaConfigs: net.MoodleNetPrimaryMsgSchemaConfigs }>
              org(): Promise<{ orgSchemaConfigs: org.OrgPrimaryMsgSchemaConfigs }>
            }
            webapp: {
              layouts(): Promise<Layouts>
              deploymentInfo(): Promise<Deploymen!tInfo>
            }
            moodlenet: {
              info(): Promise<{ moodlenet: net.MoodleNetInfo; org: org.OrgInfo }>
            }
            system: {
              configs(): Promise<{ configs: Configs }>
            }
          }
        }
      }
    }
    // secondary: {
    //   'v5.0': {
    //     moodle: {
    //       netWebappNextjs: {
    //         db: {
    //           getConfigs(): Promise<{ configs: Configs }>
    //         }
    //       }
    //     }
    //   }
    // }
  }
}
