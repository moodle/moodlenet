import { create } from '@moodlenet/system-entities/server'
import { shell } from '../../shell.mjs'
import { IscedField, IscedGrade } from '../../sys-entities.mjs'
import type { IscedFieldDataType, IscedGradeDataType } from '../../types.mjs'
import EdMetaIscedFields from './raw/EdMetaIscedFields.mjs'
import EdMetaIscedGrades from './raw/EdMetaIscedGrades.mjs'
// import EdMetaIscedGrades from './raw/EdMetaIscedGrades.mjs'
// import EdMetaTypes from './raw/EdMetaTypes.mjs'

await Promise.all([initIscedFields(), initIscedGrades()])

async function initIscedFields() {
  const IscedFieldDataDocs = EdMetaIscedFields.map(({ _key, published, codePath, name }) => {
    const IscedFieldDataDoc: IscedFieldDataType & { _key: string } = {
      _key,
      published,
      codePath,
      name,
    }
    return IscedFieldDataDoc
  })
  await Promise.all(
    IscedFieldDataDocs.map(IFData => {
      return shell.call(create)(IscedField.entityClass, IFData, { pkgCreator: true })
    }),
  )
}

async function initIscedGrades() {
  const IscedGradeDataDocs = EdMetaIscedGrades.map(({ _key, published, codePath, name }) => {
    const IscedGradeDataDoc: IscedGradeDataType & { _key: string } = {
      _key,
      published,
      codePath,
      name,
    }
    return IscedGradeDataDoc
  })
  await Promise.all(
    IscedGradeDataDocs.map(IGData => {
      return shell.call(create)(IscedGrade.entityClass, IGData, { pkgCreator: true })
    }),
  )
}
