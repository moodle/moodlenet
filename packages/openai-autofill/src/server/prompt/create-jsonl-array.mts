import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import bloomsCognitivesFineTuning from './meta-data/bloomsCognitivesFineTuning.mjs'
import iscedFields4CharsFineTuning from './meta-data/iscedFields4CharsFineTuning.mjs'
import iscedGradesFineTuning from './meta-data/iscedGradesFineTuning.mjs'
import langFineTuning from './meta-data/langFineTuning.mjs'
import resTypeFineTuning from './meta-data/resTypeFineTuning.mjs'
export const systemMsgStrings: string[] = [
  // [
  `you are an assistant specialized in categorizing educational resources`,
  `you will be given a text extracted from an educational resource, and your task is to categorize the resource based on its content and features and generate a short suitable "title" and a brief "summary"`,
  `you will use the following instructions and code-mappings for categorizing educational resources`,
  // `you, as an assistant, won't ever interact directly with humans, instead you will be interacting with a computer program, which will be interacting with humans`,
  // `you will be prompted exclusively to summarize and categorize educational resources based on their content and features`,
  // `when categorizing you will attempt to match the most suitable category for the resouce, exclusively among the provided options`,
  // `each prompt will contain a brief explanation of the resource format (is it a web-page, an online video, an user-uploaded file with a particular file-extension) and eventually some more context, followed by a text, extracted from the resource content itself`,
  // ],
  // [
  //   `you will respond each prompt with a call to the function "${FN_NAME}" passing the parameters:
  //     "${par('title')}"
  //     "${par('summary')}"
  //     "${par('iscedFieldCode')}"
  //     "${par('iscedGradeCode')}"
  //     "${par('bloomsCognitive')}"
  //     "${par('resourceTypeCode')}"
  //     "${par('languageCode')}"
  // detailed as follows`,
  // ],
  // [
  // `you will value "${par(
  //   'title'
  // )}" generating a short title suitable for the educational resource at most 8 words long`,
  // `you will value "${par(
  //   'summary'
  // )}" generating a brief summary of the educational resource at most 750 words long`,
  // ],
  ...iscedFields4CharsFineTuning.openaiSystem,
  ...iscedGradesFineTuning.openaiSystem,
  ...resTypeFineTuning.openaiSystem,
  ...langFineTuning.openaiSystem,
  ...bloomsCognitivesFineTuning.openaiSystem,
]

export const systemMessagesJsonl = {
  messages: toSystemMessage(systemMsgStrings) /* .concat([
    {
      role: 'assistant',
      content: `ok, when I will be prompted to classify a resource I will always and exclusively call the function "${FN_NAME}" passing proper parameters for categorizing the resource, and I won't ever reply with natural language`,
    },
  ]) */,
}

function toSystemMessage(contents: string[]) {
  const messages = contents
    .map<ChatCompletionMessageParam>(content => ({
      //  | { role: string; function_call: { name: string; parameters: string } }
      role: 'system',
      content,
    }))
    .concat([
      //       {
      //         role: `user`,
      //         content: `
      // this educational resource is an uploaded file with ".pdf" extension
      // the extracted text is the following
      // ${pdf1}
      // `,
      //       },
      //       {
      //         role: `assistant`,
      //         function_call: {
      //           name: FN_NAME,
      //           parameters: `{
      //   "title":"Energy-Aware and Reliability-Based Localization-Free Cooperative Acoustic Wireless Sensor Networks",
      //   "description": "In underwater wireless sensor networks (UWSNs), protocols with efficient energy and reliable communication are challenging, due to the unpredictable aqueous environment. The sensor nodes deployed in the specific region can not last for a long time communicating with each other because of limited energy. Also, the low speed of the acoustic waves and the small available bandwidth produce high latency as well as high transmission loss, which affects the network reliability. To address such problems, several protocols exist in literature. However, these protocols lose energy efficiency and reliability, as they calculate the geographical coordinates of the node or they do not avoid unfavorable channel conditions. To tackle these challenges, this article presents the two novel routing protocol for UWSNs. The first one energy path and channel aware (EPACA) protocol transmits data from a bottom of the water to the surface sink by taking node’s residual energy (Re), packet history (Hp), distance (d) and bit error rate (BER). In EPACA protocol, a source node computes a function value for every neighbor node. The most prior node in terms of calculated function is considered as the tparet destination. However, the EPACA protocol may not always guarantee packet reliability, as it delivers packets over a single path. To maintain the packet reliability in the network, the cooperative-energy path and channel aware (CoEPACA) routing scheme is added which uses relay nodes in packet advancement. In the CoEPACA protocol, the destination node receives various copies from the source and relay(s). The received data at the destination from multiple routes make the network more reliable due to avoiding the erroneous data. The MATLAB simulations results validated the performance of the proposed algorithms. The EPACA protocol consumed 29.01% and the CoEPACA protocol 19.04% less energy than the counterpart scheme. In addition, the overall 12.40% improvement is achieved in the packet’s reliability. Also, the EPACA protocol outperforms for packets’ latency and network lifetime.",
      //   "iscedFieldCode": "F01",
      //   "iscedGradeCode": "ED5",
      //   "bloomsCognitive": [{"level":"1","verb":"Describe","description":"How to transmit data with a certain protocol from underwater to land"}],
      // }`,
      //         },
      //       },
    ])
  return messages
}
