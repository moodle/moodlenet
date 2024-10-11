import { date_time_string, map, mimetype, ok_ko, path } from '@moodle/lib-types'
import { AuthenticatedSession } from '../iam'
import { profileImage } from '../user-hone'

export type blob_meta = {
  size: number
  originalFilename: string
  created: date_time_string
  mimetype: mimetype
  originalSize?: number
  name: string
}

export type temp_blob_meta = blob_meta & {
  userSession: AuthenticatedSession
}

export type dir<_dir> = {
  [key in keyof _dir]: _dir[key] extends file ? file : dir<_dir[key]>
}
export type file = () => path

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
}

export type useTempFileResult = ok_ko<
  void,
  {
    tempNotFound: unknown
    move: {
      error: string
    }
  }
>

export type useTempFileAsWebImageResult = ok_ko<
  void,
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
