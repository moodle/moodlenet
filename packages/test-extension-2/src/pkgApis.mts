import { useApis } from '@moodlenet/core'
import testExtension from '@moodlenet/test-extension'

export const testExtensionApis = await useApis(import.meta, testExtension)
