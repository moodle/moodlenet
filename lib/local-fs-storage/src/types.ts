import { map, path, url_path_string } from '@moodle/lib-types'
import { profileImageType } from '@moodle/module/user-profile'

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
// FIXME:
// FIXME:
// FIXME:
// FIXME: should this FILESYSTEM STRUCTURE be in DOMAIN ?
// FIXME: also .. review it completely ... it doesn't ensure you get to an end leaf to save a file
// FIXME:    e.g. to save a collectoin image, it accepts userProfile.xxxx.drafts.eduCollection.yyy
// FIXME:    instead of userProfile.xxxx.drafts.eduCollection.yyy.image
// FIXME:    that's ok when want to reference a directory, but no good for saving a file
export type filesystem = {
  userProfile: {
    [userProfileId in string]: {
      profile: map<'image', profileImageType>
      drafts: {
        eduResource: {
          [eduResourceDraftId in string]: {
            image: 'image'
            asset: 'asset'
          }
        }
        eduCollection: {
          [eduCollectionDraftId in string]: {
            image: 'image'
          }
        }
      }
    }
  }
}

export type filetype = 'image'
