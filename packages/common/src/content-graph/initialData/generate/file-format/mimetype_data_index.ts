import { FileFormatType } from '../../../types/node'
import application from './data/application'
import audio from './data/audio'
import font from './data/font'
import image from './data/image'
import message from './data/message'
import model from './data/model'
import multipart from './data/multipart'
import text from './data/text'
import video from './data/video'

// https://www.iana.org/assignments/media-types/media-types.xhtml
export const mimetypesMap: { [t in FileFormatType]: { name: string; mimetype: string }[] } = {
  application,
  audio,
  font,
  image,
  message,
  model,
  multipart,
  text,
  video,
}
