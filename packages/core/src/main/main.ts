import { boot } from '../boot'
import './env'

const deploymentFolder = process.env.WD_DEPLOYMENT_FOLDER ?? process.cwd()

boot({ deploymentFolder })
