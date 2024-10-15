import { date_time_string, map, mimetype, ok_ko, path, url_path_string } from '@moodle/lib-types'
import { user_id } from '../../iam'
import { profileImage } from '../../userHome'

export * from './primary-schemas'

export type fileHashes = {
  sha256: string
  // ssdeep: string
}

export type uploaded_blob_meta = {
  name: string
  size: number
  mimetype: mimetype
  uploaded: date_time_string
  hash: fileHashes
  uploadedBy: {
    userId: user_id
    primarySessionId: string
  }
  originalFilename: string
  originalSize?: number
  originalHash?: number
}

export type dir<_dir> = {
  [key in keyof _dir]: _dir[key] extends file ? file : dir<_dir[key]>
}
export type file = (alias: string) => path

export type webImageSize = 'small' | 'medium' | 'large'
export type webImageResizesConfigs = {
  small: number
  medium: number
  large: number
}

export type uploadMaxSizeConfigs = {
  max: number
  webImage: number
}

export interface Configs {
  uploadMaxSize: uploadMaxSizeConfigs
  webImageResizes: webImageResizesConfigs
  tempFileMaxRetentionSeconds: number
}

export type useTempFileResult = ok_ko<
  { blobMeta: uploaded_blob_meta },
  {
    tempNotFound: unknown
    move: {
      error: string
    }
  }
>

export type useTempFileAsWebImageResult = ok_ko<
  { blobMeta: uploaded_blob_meta },
  {
    tempNotFound: unknown
    move: {
      error: string
    }
    invalidImage: unknown
  }
>
export type filesystem = {
  userHome: {
    [userHomeId in string]: {
      profile: map<'image', profileImage>
    }
  }
}

type filetype = 'image'

export type fsPathGetter = () => path
export type fsUrlPathGetter = () => url_path_string
export type fs<_fs, getterType> = {
  [fsId in keyof _fs]: getterType &
    (_fs[fsId] extends filetype ? _fs[fsId] : fs<_fs[fsId], getterType>)
}

export type fsDirectories = {
  currentDomainDir: string
  temp: string
  fsStorage: string
}
