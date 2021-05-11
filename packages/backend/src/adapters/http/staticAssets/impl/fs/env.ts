import * as Yup from 'yup'
type Env = {
  rootFolder: string
}

const ROOT_FOLDER = process.env.STATICASSETS_FS_ROOT_FOLDER

const Validator = Yup.object<Env>({
  rootFolder: Yup.string().required(),
})

const env = Validator.validateSync({
  rootFolder: ROOT_FOLDER,
})

export default env!
