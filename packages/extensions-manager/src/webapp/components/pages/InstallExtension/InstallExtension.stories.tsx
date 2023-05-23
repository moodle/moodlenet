import type { AdminSettingsItem } from '@moodlenet/react-app/ui'
import { action } from '@storybook/addon-actions'
import { useFormik } from 'formik'
import type { FC } from 'react'
import type { SchemaOf } from 'yup'
import { object, string } from 'yup'
import type {
  InstallExtensionProps,
  InstallLocalPathExtensionFormValues,
} from './InstallExtension.js'
import InstallExtension, { InstallExtensionMenu } from './InstallExtension.js'

import packageIcon3 from '../../../assets/icons/package-icon-3.png'
import packageIcon5 from '../../../assets/icons/package-icon-5.png'
import type { ExtensionType } from '../Extensions/Extensions.js'
// import packageIcon4 from '../../../assets/icons/package-icon-4.png'
// import packageIcon2 from '../../../assets/icons/package-icon-2.png'
// import packageIcon1 from '../../../assets/icons/package-icon.png'

export const validationSchema: SchemaOf<InstallLocalPathExtensionFormValues> = object({
  localPath: string().max(4096).min(3).required(/* t */ `Please provide a local path`),
})

export const useExtensionStoryProps = (overrides?: {
  // editFormValues?: Partial<InstallExtensionData>
  props?: Partial<ExtensionType>
}): ExtensionType => {
  return {
    name: '@moodlenet/component-library',
    displayName: 'Component library',
    description: 'Library containing many components used in the web app',
    installed: false,
    isInstallingUninstalling: false,
    installUninstallSucces: false,
    toggleInstallingUninstalling: action('Toogle install uninstall'),
    repositoryUrl:
      'https://gitlab.com/moodlenet/moodlenet/-/tree/moodlenet3-dev/packages/component-library',
    readme:
      '# MoodleNet Component library\n\n## System Requirements\n\n### NodeJs\n\nThis software runs on [nodejs](https://nodejs.org/) `>=14.14.0`.\n\n### Sharp package requirements\n\nThis sofware leverages [sharp](https://www.npmjs.com/package/sharp) for uploaded image processing\n\nThe docs states that\n\n> Most modern macOS, Windows and Linux systems running Node.js >= 12.13.0 do not require any additional install or runtime dependencies.\n\nHowever, if you experience issues on installation or on upload functionalities, you may want to [check out sharp system requisites](https://github.com/lovell/sharp/tree/master/docs)\n\n### A running ArangoDB instance\n\nthe easiest way is using docker:\n\n```sh\n# start an ArangoDB instance\n$ docker run -e ARANGO_NO_AUTH=1 --name mnarango -p 8529:8529 -d arangodb\n```\n\n## Quick start\n\n### install Moodlenet CE Platform globally\n\n```sh\nnpm i -g @moodlenet/ce-platform\n```\n\n### set environment variables\n\nMoodleNet needs a bunch of environment variable set for nodejs process\n\n[dotenv](https://www.npmjs.com/package/dotenv) and [dotenv-expand](https://www.npmjs.com/package/dotenv-expand) are supported, so the easiest way is to make sure a proper `.env` file is present in process working directory\n\n```sh\n# sample .env file\n\nNODE_ENV=development\n\n# DB\nARANGO_URL=http://localhost:8529\n\n# ^HTTP config\n#\nHTTP_PORT=8080\nPUBLIC_URL_PROTOCOL=http\n#\n# $HTTP config\n\n# Webapp config\nREACT_APP_CUSTOM_HEAD="<script>console.log(\'this env var string will be embedded as-is in HTML>HEAD\')</script>"\n\n# smtp url\n#\n# will work with simple user:password authentication only\n# if using gmail you need to set a full-user-name if email is not in gmail domain\n# SMTP=smtps://fullusername:password@smtp.gmail.com/?pool=true\n# and probably need to enable "less secure apps access"\n# https://myaccount.google.com/lesssecureapps\nSMTP=smtps://fullusername:password@smtp.domain.com/?pool=true\n\n# ^ CRYPTO config\n#\n# RSA keys\n# https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9#gistcomment-2932501\nCRYPTO_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\\n##<keyrows separated by \\n>##\\n-----END PUBLIC KEY-----"\nCRYPTO_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\\n##<keyrows separated by \\n>##\\n-----END RSA PRIVATE KEY-----"\n#\n# $ CRYPTO keys\n\n# Folder to save content static assets (images, resources ..)\nSTATICASSETS_FS_ROOT_FOLDER=/any/path/to/uploads/directory\n# Max upload size in bytes - applies to images and resources\nASSET_UPLOADER_MAX_SIZE=10485760 # 10MB\n\n#^SETUP VARS\n#\n\n# the following variables are necessary on first run as they will be used for initial DB population\n# *** _all_ SETUP_* variables are mandatory for a correct installation ***\n# they aren\'t required for subsequent system starts, though\n\n# the domain hosting your MoodleNet installation\n# in real world deployment would be something like: SETUP_ORGANIZATION_DOMAIN=my.example.domain.com\nSETUP_ORGANIZATION_DOMAIN=localhost:${HTTP_PORT}\n\n# an accessible email for the "organization user"\n# super-admin will use this for authenticating as org-user\nSETUP_ORGANIZATION_EMAIL=your.org.user@email.com\n\n# following vars are used to fill the DB with your organization info,\n# displayed in various contexts, from webapp to email notifications\nSETUP_ORGANIZATION_NAME=My Awesome Organization\nSETUP_ORGANIZATION_DESCRIPTION="My organization description\\nmultiline"\nSETUP_ORGANIZATION_SUBTITLE=My organization subtitle\n# logos point to accessible images of any browser-supported mimetype\nSETUP_ORGANIZATION_LOGO=https://url-to.any/logo.png\nSETUP_ORGANIZATION_SMALL_LOGO=https://url-to.any/small-logo.svg\n# whether a newly signed up user is marked as published or not [true|false]\nSETUP_2_0_1_NEW_USER_PUBLISHED=true \n#\n#$SETUP VARS\n```\n\n### Start Moodlenet CE Platform\n\nstart the platform using `npx`\n\n```sh\n# make sure env vars are set or a proper .env file is present in cwd\nnpx start-moodlenet-ce\n```\n\nOnly on first run the process populates the DB, and use the `^SETUP VARS` section of env variables\n\nHTTP server starts on 8080.\n\nBrowse your MoodleNet @ [http://localhost:8080/](http://localhost:8080/) enjoy MoodleNet ;)\n\n## Organization User\n\nOn first run, the organization user is ceated bound to `SETUP_ORGANIZATION_EMAIL` and without any valid password set.\n\nYou can perform your first login as org-user by the recover password workflow, clicking `[or recover password]` link in login page\n\nFollow the instructions you\'ll receive @`SETUP_ORGANIZATION_EMAIL`, and choose a password for org-user\n\nSubsequent logins, you can fill in the login form with `SETUP_ORGANIZATION_EMAIL` and the choosen password\n',
    ...overrides?.props,
  }
}

export const useInstallExtensionStoryProps = (overrides?: {
  // editFormValues?: Partial<InstallExtensionData>
  props?: Partial<InstallExtensionProps>
}): InstallExtensionProps => {
  const extensions: ExtensionType[] = [
    useExtensionStoryProps({
      props: {
        name: '@moodlenet/simple-email-auth',
        displayName: 'Simple email auth',
        description: 'Add an email authentification method',
        repositoryUrl:
          'https://gitlab.com/moodlenet/moodlenet/-/tree/moodlenet3-dev/packages/simple-email-auth',
        readme:
          '# MoodleNet Simple email auth\n\n## System Requirements\n\n### NodeJs\n\nThis software runs on [nodejs](https://nodejs.org/) `>=14.14.0`.\n\n### Sharp package requirements\n\nThis sofware leverages [sharp](https://www.npmjs.com/package/sharp) for uploaded image processing\n\nThe docs states that\n\n> Most modern macOS, Windows and Linux systems running Node.js >= 12.13.0 do not require any additional install or runtime dependencies.\n\nHowever, if you experience issues on installation or on upload functionalities, you may want to [check out sharp system requisites](https://github.com/lovell/sharp/tree/master/docs)\n\n### A running ArangoDB instance\n\nthe easiest way is using docker:\n\n```sh\n# start an ArangoDB instance\n$ docker run -e ARANGO_NO_AUTH=1 --name mnarango -p 8529:8529 -d arangodb\n```\n\n## Quick start\n\n### install Moodlenet CE Platform globally\n\n```sh\nnpm i -g @moodlenet/ce-platform\n```\n\n### set environment variables\n\nMoodleNet needs a bunch of environment variable set for nodejs process\n\n[dotenv](https://www.npmjs.com/package/dotenv) and [dotenv-expand](https://www.npmjs.com/package/dotenv-expand) are supported, so the easiest way is to make sure a proper `.env` file is present in process working directory\n\n```sh\n# sample .env file\n\nNODE_ENV=development\n\n# DB\nARANGO_URL=http://localhost:8529\n\n# ^HTTP config\n#\nHTTP_PORT=8080\nPUBLIC_URL_PROTOCOL=http\n#\n# $HTTP config\n\n# Webapp config\nREACT_APP_CUSTOM_HEAD="<script>console.log(\'this env var string will be embedded as-is in HTML>HEAD\')</script>"\n\n# smtp url\n#\n# will work with simple user:password authentication only\n# if using gmail you need to set a full-user-name if email is not in gmail domain\n# SMTP=smtps://fullusername:password@smtp.gmail.com/?pool=true\n# and probably need to enable "less secure apps access"\n# https://myaccount.google.com/lesssecureapps\nSMTP=smtps://fullusername:password@smtp.domain.com/?pool=true\n\n# ^ CRYPTO config\n#\n# RSA keys\n# https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9#gistcomment-2932501\nCRYPTO_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\\n##<keyrows separated by \\n>##\\n-----END PUBLIC KEY-----"\nCRYPTO_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\\n##<keyrows separated by \\n>##\\n-----END RSA PRIVATE KEY-----"\n#\n# $ CRYPTO keys\n\n# Folder to save content static assets (images, resources ..)\nSTATICASSETS_FS_ROOT_FOLDER=/any/path/to/uploads/directory\n# Max upload size in bytes - applies to images and resources\nASSET_UPLOADER_MAX_SIZE=10485760 # 10MB\n\n#^SETUP VARS\n#\n\n# the following variables are necessary on first run as they will be used for initial DB population\n# *** _all_ SETUP_* variables are mandatory for a correct installation ***\n# they aren\'t required for subsequent system starts, though\n\n# the domain hosting your MoodleNet installation\n# in real world deployment would be something like: SETUP_ORGANIZATION_DOMAIN=my.example.domain.com\nSETUP_ORGANIZATION_DOMAIN=localhost:${HTTP_PORT}\n\n# an accessible email for the "organization user"\n# super-admin will use this for authenticating as org-user\nSETUP_ORGANIZATION_EMAIL=your.org.user@email.com\n\n# following vars are used to fill the DB with your organization info,\n# displayed in various contexts, from webapp to email notifications\nSETUP_ORGANIZATION_NAME=My Awesome Organization\nSETUP_ORGANIZATION_DESCRIPTION="My organization description\\nmultiline"\nSETUP_ORGANIZATION_SUBTITLE=My organization subtitle\n# logos point to accessible images of any browser-supported mimetype\nSETUP_ORGANIZATION_LOGO=https://url-to.any/logo.png\nSETUP_ORGANIZATION_SMALL_LOGO=https://url-to.any/small-logo.svg\n# whether a newly signed up user is marked as published or not [true|false]\nSETUP_2_0_1_NEW_USER_PUBLISHED=true \n#\n#$SETUP VARS\n```\n\n### Start Moodlenet CE Platform\n\nstart the platform using `npx`\n\n```sh\n# make sure env vars are set or a proper .env file is present in cwd\nnpx start-moodlenet-ce\n```\n\nOnly on first run the process populates the DB, and use the `^SETUP VARS` section of env variables\n\nHTTP server starts on 8080.\n\nBrowse your MoodleNet @ [http://localhost:8080/](http://localhost:8080/) enjoy MoodleNet ;)\n\n## Organization User\n\nOn first run, the organization user is ceated bound to `SETUP_ORGANIZATION_EMAIL` and without any valid password set.\n\nYou can perform your first login as org-user by the recover password workflow, clicking `[or recover password]` link in login page\n\nFollow the instructions you\'ll receive @`SETUP_ORGANIZATION_EMAIL`, and choose a password for org-user\n\nSubsequent logins, you can fill in the login form with `SETUP_ORGANIZATION_EMAIL` and the choosen password\n',
        icon: packageIcon3,
      },
    }),
    useExtensionStoryProps({
      props: {
        name: '@moodlenet/ed-resource',
        displayName: 'Resource',
        description: 'Create, view and share resources',
        icon: packageIcon5,
        // installed: true,
        // installUninstallSucces: true,
        developedByMoodleNet: true,
        repositoryUrl:
          'https://gitlab.com/moodlenet/moodlenet/-/tree/moodlenet3-dev/packages/react-app',
        readme:
          '# MoodleNet Resource\n\n## System Requirements\n\n### NodeJs\n\nThis software runs on [nodejs](https://nodejs.org/) `>=14.14.0`.\n\n### Sharp package requirements\n\nThis sofware leverages [sharp](https://www.npmjs.com/package/sharp) for uploaded image processing\n\nThe docs states that\n\n> Most modern macOS, Windows and Linux systems running Node.js >= 12.13.0 do not require any additional install or runtime dependencies.\n\nHowever, if you experience issues on installation or on upload functionalities, you may want to [check out sharp system requisites](https://github.com/lovell/sharp/tree/master/docs)\n\n### A running ArangoDB instance\n\nthe easiest way is using docker:\n\n```sh\n# start an ArangoDB instance\n$ docker run -e ARANGO_NO_AUTH=1 --name mnarango -p 8529:8529 -d arangodb\n```\n\n## Quick start\n\n### install Moodlenet CE Platform globally\n\n```sh\nnpm i -g @moodlenet/ce-platform\n```\n\n### set environment variables\n\nMoodleNet needs a bunch of environment variable set for nodejs process\n\n[dotenv](https://www.npmjs.com/package/dotenv) and [dotenv-expand](https://www.npmjs.com/package/dotenv-expand) are supported, so the easiest way is to make sure a proper `.env` file is present in process working directory\n\n```sh\n# sample .env file\n\nNODE_ENV=development\n\n# DB\nARANGO_URL=http://localhost:8529\n\n# ^HTTP config\n#\nHTTP_PORT=8080\nPUBLIC_URL_PROTOCOL=http\n#\n# $HTTP config\n\n# Webapp config\nREACT_APP_CUSTOM_HEAD="<script>console.log(\'this env var string will be embedded as-is in HTML>HEAD\')</script>"\n\n# smtp url\n#\n# will work with simple user:password authentication only\n# if using gmail you need to set a full-user-name if email is not in gmail domain\n# SMTP=smtps://fullusername:password@smtp.gmail.com/?pool=true\n# and probably need to enable "less secure apps access"\n# https://myaccount.google.com/lesssecureapps\nSMTP=smtps://fullusername:password@smtp.domain.com/?pool=true\n\n# ^ CRYPTO config\n#\n# RSA keys\n# https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9#gistcomment-2932501\nCRYPTO_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\\n##<keyrows separated by \\n>##\\n-----END PUBLIC KEY-----"\nCRYPTO_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\\n##<keyrows separated by \\n>##\\n-----END RSA PRIVATE KEY-----"\n#\n# $ CRYPTO keys\n\n# Folder to save content static assets (images, resources ..)\nSTATICASSETS_FS_ROOT_FOLDER=/any/path/to/uploads/directory\n# Max upload size in bytes - applies to images and resources\nASSET_UPLOADER_MAX_SIZE=10485760 # 10MB\n\n#^SETUP VARS\n#\n\n# the following variables are necessary on first run as they will be used for initial DB population\n# *** _all_ SETUP_* variables are mandatory for a correct installation ***\n# they aren\'t required for subsequent system starts, though\n\n# the domain hosting your MoodleNet installation\n# in real world deployment would be something like: SETUP_ORGANIZATION_DOMAIN=my.example.domain.com\nSETUP_ORGANIZATION_DOMAIN=localhost:${HTTP_PORT}\n\n# an accessible email for the "organization user"\n# super-admin will use this for authenticating as org-user\nSETUP_ORGANIZATION_EMAIL=your.org.user@email.com\n\n# following vars are used to fill the DB with your organization info,\n# displayed in various contexts, from webapp to email notifications\nSETUP_ORGANIZATION_NAME=My Awesome Organization\nSETUP_ORGANIZATION_DESCRIPTION="My organization description\\nmultiline"\nSETUP_ORGANIZATION_SUBTITLE=My organization subtitle\n# logos point to accessible images of any browser-supported mimetype\nSETUP_ORGANIZATION_LOGO=https://url-to.any/logo.png\nSETUP_ORGANIZATION_SMALL_LOGO=https://url-to.any/small-logo.svg\n# whether a newly signed up user is marked as published or not [true|false]\nSETUP_2_0_1_NEW_USER_PUBLISHED=true \n#\n#$SETUP VARS\n```\n\n### Start Moodlenet CE Platform\n\nstart the platform using `npx`\n\n```sh\n# make sure env vars are set or a proper .env file is present in cwd\nnpx start-moodlenet-ce\n```\n\nOnly on first run the process populates the DB, and use the `^SETUP VARS` section of env variables\n\nHTTP server starts on 8080.\n\nBrowse your MoodleNet @ [http://localhost:8080/](http://localhost:8080/) enjoy MoodleNet ;)\n\n## Organization User\n\nOn first run, the organization user is ceated bound to `SETUP_ORGANIZATION_EMAIL` and without any valid password set.\n\nYou can perform your first login as org-user by the recover password workflow, clicking `[or recover password]` link in login page\n\nFollow the instructions you\'ll receive @`SETUP_ORGANIZATION_EMAIL`, and choose a password for org-user\n\nSubsequent logins, you can fill in the login form with `SETUP_ORGANIZATION_EMAIL` and the choosen password\n',
      },
    }),
    useExtensionStoryProps({
      props: {
        name: '@moodlenet/ed-resource',
        displayName: 'Resource',
        description: 'Extension to display resources information',
        // icon: packageIcon2,
        developedByMoodleNet: true,
        repositoryUrl:
          'https://gitlab.com/moodlenet/moodlenet/-/tree/moodlenet3-dev/packages/ed-resource',
        readme:
          '# MoodleNet Resource\n\n## System Requirements\n\n### NodeJs\n\nThis software runs on [nodejs](https://nodejs.org/) `>=14.14.0`.\n\n### Sharp package requirements\n\nThis sofware leverages [sharp](https://www.npmjs.com/package/sharp) for uploaded image processing\n\nThe docs states that\n\n> Most modern macOS, Windows and Linux systems running Node.js >= 12.13.0 do not require any additional install or runtime dependencies.\n\nHowever, if you experience issues on installation or on upload functionalities, you may want to [check out sharp system requisites](https://github.com/lovell/sharp/tree/master/docs)\n\n### A running ArangoDB instance\n\nthe easiest way is using docker:\n\n```sh\n# start an ArangoDB instance\n$ docker run -e ARANGO_NO_AUTH=1 --name mnarango -p 8529:8529 -d arangodb\n```\n\n## Quick start\n\n### install Moodlenet CE Platform globally\n\n```sh\nnpm i -g @moodlenet/ce-platform\n```\n\n### set environment variables\n\nMoodleNet needs a bunch of environment variable set for nodejs process\n\n[dotenv](https://www.npmjs.com/package/dotenv) and [dotenv-expand](https://www.npmjs.com/package/dotenv-expand) are supported, so the easiest way is to make sure a proper `.env` file is present in process working directory\n\n```sh\n# sample .env file\n\nNODE_ENV=development\n\n# DB\nARANGO_URL=http://localhost:8529\n\n# ^HTTP config\n#\nHTTP_PORT=8080\nPUBLIC_URL_PROTOCOL=http\n#\n# $HTTP config\n\n# Webapp config\nREACT_APP_CUSTOM_HEAD="<script>console.log(\'this env var string will be embedded as-is in HTML>HEAD\')</script>"\n\n# smtp url\n#\n# will work with simple user:password authentication only\n# if using gmail you need to set a full-user-name if email is not in gmail domain\n# SMTP=smtps://fullusername:password@smtp.gmail.com/?pool=true\n# and probably need to enable "less secure apps access"\n# https://myaccount.google.com/lesssecureapps\nSMTP=smtps://fullusername:password@smtp.domain.com/?pool=true\n\n# ^ CRYPTO config\n#\n# RSA keys\n# https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9#gistcomment-2932501\nCRYPTO_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\\n##<keyrows separated by \\n>##\\n-----END PUBLIC KEY-----"\nCRYPTO_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\\n##<keyrows separated by \\n>##\\n-----END RSA PRIVATE KEY-----"\n#\n# $ CRYPTO keys\n\n# Folder to save content static assets (images, resources ..)\nSTATICASSETS_FS_ROOT_FOLDER=/any/path/to/uploads/directory\n# Max upload size in bytes - applies to images and resources\nASSET_UPLOADER_MAX_SIZE=10485760 # 10MB\n\n#^SETUP VARS\n#\n\n# the following variables are necessary on first run as they will be used for initial DB population\n# *** _all_ SETUP_* variables are mandatory for a correct installation ***\n# they aren\'t required for subsequent system starts, though\n\n# the domain hosting your MoodleNet installation\n# in real world deployment would be something like: SETUP_ORGANIZATION_DOMAIN=my.example.domain.com\nSETUP_ORGANIZATION_DOMAIN=localhost:${HTTP_PORT}\n\n# an accessible email for the "organization user"\n# super-admin will use this for authenticating as org-user\nSETUP_ORGANIZATION_EMAIL=your.org.user@email.com\n\n# following vars are used to fill the DB with your organization info,\n# displayed in various contexts, from webapp to email notifications\nSETUP_ORGANIZATION_NAME=My Awesome Organization\nSETUP_ORGANIZATION_DESCRIPTION="My organization description\\nmultiline"\nSETUP_ORGANIZATION_SUBTITLE=My organization subtitle\n# logos point to accessible images of any browser-supported mimetype\nSETUP_ORGANIZATION_LOGO=https://url-to.any/logo.png\nSETUP_ORGANIZATION_SMALL_LOGO=https://url-to.any/small-logo.svg\n# whether a newly signed up user is marked as published or not [true|false]\nSETUP_2_0_1_NEW_USER_PUBLISHED=true \n#\n#$SETUP VARS\n```\n\n### Start Moodlenet CE Platform\n\nstart the platform using `npx`\n\n```sh\n# make sure env vars are set or a proper .env file is present in cwd\nnpx start-moodlenet-ce\n```\n\nOnly on first run the process populates the DB, and use the `^SETUP VARS` section of env variables\n\nHTTP server starts on 8080.\n\nBrowse your MoodleNet @ [http://localhost:8080/](http://localhost:8080/) enjoy MoodleNet ;)\n\n## Organization User\n\nOn first run, the organization user is ceated bound to `SETUP_ORGANIZATION_EMAIL` and without any valid password set.\n\nYou can perform your first login as org-user by the recover password workflow, clicking `[or recover password]` link in login page\n\nFollow the instructions you\'ll receive @`SETUP_ORGANIZATION_EMAIL`, and choose a password for org-user\n\nSubsequent logins, you can fill in the login form with `SETUP_ORGANIZATION_EMAIL` and the choosen password\n',
      },
    }),
  ]

  return {
    // selectedExt: ,
    extensions: extensions,
    devMode: true,
    isInstalling: false,
    // installSucces: true,
    setIsInstalling: action('Set is installing'),
    installLocalPathExtensionForm: useFormik<InstallLocalPathExtensionFormValues>({
      onSubmit: action('submit InstallExtension settings'),
      validationSchema,
      initialValues: {
        localPath: '',
        ...overrides?.props?.installLocalPathExtensionForm?.initialValues,
      },
    }),
    ...overrides?.props,
  }
}

export const SettingsInstallItem: FC = () => (
  <InstallExtension {...useInstallExtensionStoryProps()} />
)

export const useElements = (): AdminSettingsItem => {
  return {
    Menu: InstallExtensionMenu,
    Content: SettingsInstallItem,
    key: 'content-install-extension',
  }
}
