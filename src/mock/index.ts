import { optionsType, handlerType, outputType, outputDataType } from '@/interfaces';

const json = require('./5fc4431583db1b30eca2a0b0.json');
// const json = {
//   funcDefine: [
//     {
//       identifier: '',
//       name: '',
//       json: '',
//       type: '',
//       _id: '',
//       map: {},
//       statusDefine: {},
//       order: ['']
//     }
//   ],
//   deviceName: '',
//   productModel: '',
//   excludeMap: {},
//   hideMap: {},
//   moreOption: {}
// };

const input: outputDataType = {
  functype: 0,
  Pow: 0,
  Mod: 1,
  SetTem: 25,
  WdSpd: 5,
  Quiet: 0
};

const handler: handlerType = (output: outputType): any => {
  console.log('output------------------', output);
};

const customize = {};

const options: optionsType = {
  config: json,
  input,
  handler,
  customize
};

export default options;
