import { File, Text } from '@asyncapi/generator-react-sdk'

const main = (
  /** @type {import '@asyncapi/generator-react-sdk'.TemplateContext<unknonw> } */
  props,
) => {
  const { asyncapi, params, originalAsyncAPI } = props
  return (
    <File name={`root.json`}>
      <Text newLines={2}>
        {JSON.stringify(
          {
            title: asyncapi.info().title(),
            params,
            originalAsyncAPIStr: originalAsyncAPI,
            props,
          },
          null,
          2,
        )}
      </Text>
    </File>
  )
}
export default main
