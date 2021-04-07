export interface optionsType {
  config: configType;
  input: inputDataType;
  handler: handlerType;
  customize: {};
}

export interface configType {
  funcDefine: modelsType;
  deviceName: string;
  productModel: string;
  excludeMap: relationMapType;
  hideMap: relationMapType;
  moreOption: any;
}

export interface handlerType {
  (output: outputType): any;
}

export interface inputDataType {
  [propName: string]: number;
}

export interface outputDataType {
  [propName: string]: number;
}

export interface outputType {
  data: outputDataType;
  type: string;
  [propName: string]: undefined | string | outputDataType;
}

export interface modelType {
  identifier: string;
  name: string;
  json: string;
  type: string;
  _id: string;
  map: object;
  statusDefine: statusType;
  order: string[];
}

export interface modelsType {
  map(arg0: (model: modelType) => void): string[] | undefined;
  filter(arg0: (model: modelType) => void): modelType | undefined;
  forEach(arg0: (model: modelType) => void): void;
  [index: number]: modelType;
}

export interface relationMapType {
  [propName: string]: string[];
}

export interface statusType {
  [propName: string]: {
    isCheck: Boolean;
    value: number;
    name: string;
    customize: string | Boolean;
    excludeArr: undefined | string[];
    hideArr: undefined | string[];
    icon:
      | undefined
      | {
          [propName: string]: string;
        };
    miniIcon:
      | undefined
      | {
          [propName: string]: string;
        };
    moreCommand: { [propName: string]: number };
  };
}
