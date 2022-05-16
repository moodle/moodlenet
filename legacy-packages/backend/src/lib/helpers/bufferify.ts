type FileBag = {
  name: string
  data: Buffer
  mimetype: string
}
type BufferifyMeta = {
  key: string
  files: Buffer[]
}

export function bufferify(object: any, fileDataKeyPlaceholder: string) {
  const meta: BufferifyMeta = { files: [], key: fileDataKeyPlaceholder }
  const clonedObject = JSON.parse(JSON.stringify(object))
  const valueWithPlaceholders = bufferifyTraverse(meta)(clonedObject)
  const keyLenghtBuffer = Uint8Array.of(fileDataKeyPlaceholder.length)
  const keyBuffer = Buffer.from(fileDataKeyPlaceholder)
  const filesMaxIndexBuffer = Uint8Array.of(meta.files.length - 1)
  const filesBuffers = meta.files.flatMap(fileBuffer => {
    const lengthBuffer = Buffer.alloc(4)
    lengthBuffer.writeInt32BE(fileBuffer.length)
    return [lengthBuffer, fileBuffer]
  })
  const jsonBuffer = Buffer.from(JSON.stringify(valueWithPlaceholders))

  return Buffer.concat([keyLenghtBuffer, keyBuffer, filesMaxIndexBuffer, ...filesBuffers, jsonBuffer])
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

export function unbufferify(buffer: Buffer) {
  let _offset = 0

  const fileDataKeyPlaceholderLength = buffer.readUInt8(_offset)
  _offset += 1

  const fileDataKeyPlaceholder = buffer.slice(_offset, _offset + fileDataKeyPlaceholderLength).toString()
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
      Object.keys(o || {}).forEach(prop => {
        const propVal = o[prop]
        if (prop === 'data' && 'string' === typeof propVal && ['mimetype', 'name'].every(_ => _ in o)) {
          const [keyPlaceholder, fileBufferIndexStr] = propVal.split('@')
          const fileBufferIndex = fileBufferIndexStr && Number(fileBufferIndexStr)
          if (
            keyPlaceholder === fileDataKeyPlaceholder &&
            'number' === typeof fileBufferIndex &&
            !isNaN(fileBufferIndex)
          ) {
            o[prop] = fileBuffers[fileBufferIndex]
          }
        } else if ('object' === typeof propVal) {
          replaceBufs(propVal)
        }
      })
    }
  })(json)
  return json
}

function isFileBag(_: any): _ is FileBag {
  return typeof _ === 'object' && ['name', 'data', 'mimetype'].every(p => p in _) && _['data'] instanceof Buffer
}

/* */
// let file = (name: string, s: number, append: Buffer): FileBag => ({
//   data: Buffer.concat([Buffer.alloc(s).fill(255), append]),
//   mimetype: 'mime1',
//   name,
// })
// let file1 = file('file1', 3, Buffer.from('FILE1'))

// let obj = {
//   a: 1,
//   f1: file1,
//   f1_1: file1,
//   f10: file('file10', 3, Buffer.from('FILE_10')),
//   f11: file('file11', 3, Buffer.from('FILE_11')),
//   f12: file('file12', 3, Buffer.from('FILE_12')),
//   f13: file('file13', 3, Buffer.from('FILE_13')),
//   x: [
//     {
//       f: file('file_x_0_f', 3, Buffer.from('FILE_x_0_f')),
//       z: '101001010',
//       nof: {
//         data: '101001010@1',
//         mimetype: '101001010',
//         name: 'noffile2',
//       },
//     },
//   ],
// }

// log('obj', obj)
// const enc = bufferify(obj, '101001010')
// //const enc = bufferify(obj, '212132321-312312312dd45d34452s-2s25-423243-s43-2243--243')
// log('enc', enc)
// log(enc.length, JSON.stringify(obj).length /* , JSON.stringify(obj) */)
// const dec = unbufferify(enc)
// log('obj', obj)
// log('dec', dec)

// log('dec eq obj', isEqual(obj, dec))

// function log(...args: any[]) {
//   console.log(...args.map(_ => inspect(_, false, 10, true)), '\n\n')
// }
