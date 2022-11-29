import { ComponentMeta, ComponentStory } from '@storybook/react'
import { FileUploader } from './FileUploader.js'

const meta: ComponentMeta<typeof FileUploader> = {
  title: 'Atoms/FileUploader',
  component: FileUploader,
}

const FileUploaderStory: ComponentStory<typeof FileUploader> = () => (
  <FileUploader></FileUploader>
)

export const Default = FileUploaderStory.bind({})

export default meta
