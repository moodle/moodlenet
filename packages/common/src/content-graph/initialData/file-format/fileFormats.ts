import { slugify } from '../../../utils/content-graph/slug-id'
import { FileFormat, FileFormatType } from '../../types/node'
import { localOrganizationAuthId, now } from '../content'
import { mimetypesMap } from './mimetype_data_index'

export const getFileFormats = () =>
  Object.entries(mimetypesMap).reduce<FileFormat[]>((_formats, [type, mimetypesData]) => {
    const more = mimetypesData.map(mimetypeData => {
      const [, subtype] = mimetypeData.mimetype.split(`/`)
      const cleanMime = slugify({ str: mimetypeData.mimetype.replace(/\+$/g, '-plus').replace(/\+/g, '-plus-') })
      const fileFormat: FileFormat = {
        _type: 'FileFormat',
        _permId: cleanMime,
        _slug: cleanMime,
        _published: true,
        name: mimetypeData.name,
        code: mimetypeData.mimetype,
        description: `${mimetypeData.name} : ${mimetypeData.mimetype}`,
        type: type as FileFormatType,
        subtype: subtype!,
        _created: now,
        _edited: now,
        _creator: localOrganizationAuthId,
        _authKey: null,
      }
      return fileFormat
    })

    return [..._formats, ...more]
  }, [])
