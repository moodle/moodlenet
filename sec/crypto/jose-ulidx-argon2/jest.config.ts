/* eslint-disable */
export default {
  displayName: 'crypto-jose-ulidx-argon2',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/sec/crypto/jose-ulidx-argon2',
}
