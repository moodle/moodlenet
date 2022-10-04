import { useApis } from '@moodlenet/core'
import testExtension from '@moodlenet/test-extension'

export const testExtensionApis = useApis(import.meta, testExtension)
