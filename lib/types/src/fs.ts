import { path } from './data'

declare const dirtype_sym: unique symbol
export type dirPath = path & typeof dirtype_sym
declare const filetype_sym: unique symbol
export type filePath = path & typeof filetype_sym
declare const image_filetype_sym: unique symbol
export type imageFilePath = filePath & typeof image_filetype_sym

export type filePathGetter = () => filePath
export type filePaths<_fs> = {
  [fsId in keyof _fs]: _fs[fsId] extends filePath ? filePathGetter : filePaths<_fs[fsId]>
}
export type dirPathGetter = () => dirPath
export type dirPaths<_fs> = {
  [fsId in keyof _fs]: dirPathGetter & (_fs[fsId] extends filePath ? never : dirPaths<_fs[fsId]>)
}
