import { ComponentMeta, ComponentStory } from '@storybook/react'
import { default as image } from '../../../assets/img/contentBackup/fakurian2.jpg'
import { default as backupImage } from '../../../assets/img/contentBackup/gradienta3.jpg'

import { action } from '@storybook/addon-actions'
import { useImageUrl } from '../../../lib/useImageUrl.mjs'
import ImageContainer, { ImageContainerProps } from './ImageContainer.js'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Molecules/ImageContainer',
  component: ImageContainer,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  excludeStories: ['useImageContainerProps'],
  decorators: [
    Story => (
      <div style={{ maxWidth: '500', maxHeight: '500' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ImageContainer>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
type ImageContainerStory = ComponentStory<typeof ImageContainer>

export const useImageContainerProps = (): ImageContainerProps => {
  const [imageUrl] = useImageUrl(image, backupImage)
  return {
    deleteImage: action('deleteImage'),
    uploadImage: action('uploadImage'),
    imageUrl: imageUrl,
  }
}

export const Default: ImageContainerStory = () => {
  const props = useImageContainerProps()
  return (
    <div style={{ width: '500' }}>
      <ImageContainer {...props} />
    </div>
  )
}

Default.args = {}
