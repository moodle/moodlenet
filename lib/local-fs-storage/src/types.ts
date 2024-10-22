import { map, path, url_path_string } from '@moodle/lib-types'
import { profileImage } from '@moodle/module/user-profile'

export type fsPathGetter = () => path
export type fsUrlPathGetter = () => url_path_string
export type fs<_fs, getterType> = {
  [fsId in keyof _fs]: getterType & (_fs[fsId] extends filetype ? _fs[fsId] : fs<_fs[fsId], getterType>)
}

export type fsDirectories = {
  currentDomainDir: string
  temp: string
  fsStorage: string
}

export type dir<_dir> = {
  [key in keyof _dir]: _dir[key] extends file ? file : dir<_dir[key]>
}
export type file = (alias: string) => path
// VOGLIO QUESTO FILESYSTEM STRUCTURE IN DOMAIN ?
export type filesystem = {
  userProfile: {
    [userProfileId in string]: {
      profile: map<'image', profileImage>
    }
  }
}

export type filetype = 'image'
