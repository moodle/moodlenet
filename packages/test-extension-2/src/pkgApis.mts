import { pkgConnection } from '@moodlenet/core'
import testExtension from '@moodlenet/test-extension'

export const testExtensionApis = await pkgConnection(import.meta, testExtension)
