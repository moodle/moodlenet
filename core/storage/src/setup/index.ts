import { storage } from '@moodle/domain'

const MB = Math.pow(2, 20)
export const storage_default_configs: storage.Configs = {
  uploadMaxSize: {
    max: 100 * MB,
    webImage: 10 * MB,
  },
  webImageResizes: {
    large: 800,
    medium: 400,
    small: 200,
  },
  tempFileMaxRetentionSeconds: 60,
}
