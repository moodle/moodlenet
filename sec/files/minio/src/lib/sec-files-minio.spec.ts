import { secFilesMinio } from './sec-files-minio'

describe('secFilesMinio', () => {
  it('should work', () => {
    expect(secFilesMinio()).toEqual('sec-files-minio')
  })
})
