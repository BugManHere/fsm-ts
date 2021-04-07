import { configType, inputDataType, relationMapType, outputType, modelsType, handlerType } from '@/interfaces';

export interface FsmType {
  // 状态机输入
  input: undefined | inputDataType;
  // 基于状态机的事件队列
  stateQueue: any;
  // 状态详情
  stateInfo: StateInfoType;
  // 处理状态机输出
  outputHandler: OutputHandlerType;
  // 状态机初始化
  init(): void;
  // 初始化输入
  dataInit(): void;
  // 更新状态机输入
  inputHandler(newInput: undefined | inputDataType): void;
  // 功能模块更新到下一状态
  nextStatus(identifier: string): void;
  // 功能模块更新到指定状态
  toStatus(identifier: string, statusName: string): void;
}

export interface StateInfoType {
  // 状态配置
  config: configType;
  // 状态机输入
  input: undefined | inputDataType;
  [propName: string]: any;
  // 基本信息
  updateConfig(config: configType): void;
  updateInput(input: object): void;
}

export interface OutputHandlerType {
  output: undefined | outputType;
  $_fn: handlerType;
}
