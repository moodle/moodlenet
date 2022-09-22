import { pkgApis } from '@moodlenet/core'
import testExtension from '@moodlenet/test-extension'

export const testExtensionApis = pkgApis(import.meta, testExtension)
