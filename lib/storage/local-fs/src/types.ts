import { map, path } from '@moodle/lib-types'

declare const filetype_sym: unique symbol
export type filetype = typeof filetype_sym

type fsPath = string
export type filePathGetter = () => fsPath
export type files<_fs> = {
  [fsId in keyof _fs]: _fs[fsId] extends filetype ? filePathGetter : files<_fs[fsId]>
}
export type pathGetter = () => fsPath
export type paths<_fs> = {
  [fsId in keyof _fs]: pathGetter & (_fs[fsId] extends filetype ? _fs[fsId] : paths<_fs[fsId]>)
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
export type filesystem = {
  userProfile: map<{
    profile: {
      avatar: filetype
      background: filetype
    }
    drafts: {
      eduResource: map<{
        image: filetype
        asset: filetype
      }>
      eduCollection: map<{
        image: filetype
      }>
    }
  }>
}
