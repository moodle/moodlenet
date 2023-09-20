import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { FileUploader } from './FileUploader.js'

const meta: ComponentMeta<typeof FileUploader> = {
  title: 'Atoms/FileUploader',
  component: FileUploader,
}

const FileUploaderStory: ComponentStory<typeof FileUploader> = () => <FileUploader></FileUploader>

export const Default: typeof FileUploaderStory = FileUploaderStory.bind({})

export default meta
