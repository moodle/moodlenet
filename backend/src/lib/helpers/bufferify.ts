import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import { inspect } from 'util'

let file1: FileBag = {
  data: Buffer.concat([Buffer.alloc(1000000).fill(255), Buffer.from('123')]),
  mimetype: 'mime1',
  name: 'file1',
}
let file2: FileBag = {
  data: Buffer.concat([Buffer.alloc(1000000).fill(255), Buffer.from('2345')]),
  mimetype: 'mime2',
  name: 'file2',
}

let obj = {
  a: 1,
  f1: file1,
  f11: /* { ... */ file1 /* , data: file1.data.slice(0)  */ /* } */,
  f12: /* { ... */ file1 /* , data: file1.data.slice(0)  */ /* } */,
  f13: /* { ... */ file1 /* , data: file1.data.slice(0)  */ /* } */,
  f14: /* { ... */ file1 /* , data: file1.data.slice(0)  */ /* } */,
  f15: /* { ... */ file1 /* , data: file1.data.slice(0)  */ /* } */,
  f16: /* { ... */ file1 /* , data: file1.data.slice(0)  */ /* } */,
  x: [
    {
      f2: file2,
      z: 'zz',
      nof: {
        data: '2345',
        mimetype: 'nofmime2',
        name: 'noffile2',
      },
    },
  ],
}

log('obj', obj)
const enc = bufferify(
  obj,
  '212132321-312312312dd45d34452s-2s25-423243-s43-2243--243'
)
log('enc', enc)
log(enc.length, JSON.stringify(obj).length /* , JSON.stringify(obj) */)
const dec = unbufferify(enc)
log('dec', dec)
log('obj', obj)

log('dec eq obj', isEqual(obj, dec))

function log(...args: any[]) {
  console.log(...args.map((_) => inspect(_, false, 10, true)), '\n\n')
}

type FileBag = {
  name: string
  data: Buffer
  mimetype: string
}
type BufferifyMeta = {
  key: string
  files: Buffer[]
}

function bufferify(object: any, fileDataKeyPlaceholder: string) {
  const meta: BufferifyMeta = { files: [], key: fileDataKeyPlaceholder }
  const clonedObject = cloneDeep(object)
  log('cloneeq', isEqual(object, clonedObject))
  const valueWithPlaceholders = bufferifyTraverse(meta)(clonedObject)
  const keyLenghtBuffer = Uint8Array.of(fileDataKeyPlaceholder.length)
  const keyBuffer = Buffer.from(fileDataKeyPlaceholder)
  const filesMaxIndexBuffer = Uint8Array.of(meta.files.length - 1)
  const filesBuffers = meta.files.flatMap((fileBuffer) => {
    const lengthBuffer = Buffer.alloc(4)
    lengthBuffer.writeInt32BE(fileBuffer.length)
    return [lengthBuffer, fileBuffer]
  })
  const jsonBuffer = Buffer.from(JSON.stringify(valueWithPlaceholders))

  return Buffer.concat([
    keyLenghtBuffer,
    keyBuffer,
    filesMaxIndexBuffer,
    ...filesBuffers,
    jsonBuffer,
  ])
}

function bufferifyTraverse(meta: BufferifyMeta) {
  return function _bufferifyTraverse(any: any) {
    const value = any?.valueOf()
    if (!!value && typeof value === 'object') {
      if (isFileBag(value)) {
        const index = meta.files.push(value.data) - 1
        value.data = `${meta.key}@${index}` as any
      } else {
        Object.values(value).map(_bufferifyTraverse)
      }
    }
    return value
  }
}

function unbufferify(buffer: Buffer) {
  let _offset = 0

  const fileDataKeyPlaceholderLength = buffer.readUInt8(_offset)
  _offset += 1

  const fileDataKeyPlaceholder = buffer
    .slice(_offset, _offset + fileDataKeyPlaceholderLength)
    .toString()
  _offset += fileDataKeyPlaceholderLength

  const filesMaxIndex = buffer.readUInt8(_offset)
  _offset += 1

  const fileBuffers = new Array(filesMaxIndex + 1).fill(1).map(() => {
    const fileLength = buffer.readUInt32BE(_offset)
    _offset += 4

    const fileBuffer = buffer.slice(_offset, _offset + fileLength)
    _offset += fileLength

    return fileBuffer
  })
  const json = JSON.parse(buffer.slice(_offset).toString())

  ;(function replaceBufs(o: any) {
    if ('object' === typeof o) {
      Object.keys(o || {}).forEach((prop) => {
        const propVal = o[prop]
        if (
          prop === 'data' &&
          'string' === typeof propVal &&
          propVal.startsWith(fileDataKeyPlaceholder)
        ) {
          const [, fileBufferIndex] = propVal.split('@')
          o[prop] = fileBuffers[Number(fileBufferIndex)]
        } else if ('object' === typeof propVal) {
          replaceBufs(propVal)
        }
      })
    }
  })(json)
  return json
}

function isFileBag(_: any): _ is FileBag {
  return (
    typeof _ === 'object' &&
    ['name', 'data', 'mimetype'].every((p) => p in _) &&
    _['data'] instanceof Buffer
  )
}
