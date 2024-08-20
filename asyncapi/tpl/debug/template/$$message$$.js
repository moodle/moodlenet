import { File, Text } from '@asyncapi/generator-react-sdk'
import '@asyncapi/parser'
const message = (
  /** @type {
      {
        messageName:string;
        message: import '@asyncapi/parser'.MessageV3
      } & import '@asyncapi/generator-react-sdk'.TemplateContext<unknonw>
    }
  */
  props,
) => {
  const { asyncapi, params, originalAsyncAPI, messageName, message } = props

  return (
    <File name={`${messageName}.json`}>
      <Text>
        {JSON.stringify(
          {
            messageName,
            messageJson: message.json(),
            props,
          },
          null,
          2,
        )}
      </Text>
    </File>
  )
}
export default message
