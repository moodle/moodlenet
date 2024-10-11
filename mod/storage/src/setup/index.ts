import { storage } from '@moodle/domain'

export const storage_default_configs: storage.Configs = {
  uploadMaxSize: {
    max: 104857600, // 100 * 2^20
    webImage: 10485760, // 10 * 2^20
  },
  webImageResizes: {
    large: 800,
    medium: 400,
    small: 200,
  },
}
