import { EventQueue } from './queue';
import { StateInfo } from './info';
import { OutputHandler } from './output';
import { optionsType, outputDataType, inputDataType } from '@/interfaces';
import { FsmType, StateInfoType, OutputHandlerType } from '@/interfaces/class';

export class Fsm implements FsmType {
  // 状态机输入
  input: undefined | inputDataType;
  // 基于状态机的事件队列
  stateQueue: any;
  // 状态详情
  stateInfo: StateInfoType;
  // 处理状态机输出
  outputHandler: OutputHandlerType;
  constructor(options: optionsType) {
    // 创建事件队列
    this.stateQueue = new EventQueue();
    // 更新状态详情
    this.stateInfo = new StateInfo(options.config, options.input);
    // 输出处理工具
    this.outputHandler = new OutputHandler(options.handler);
    // 更新状态机输入
    this.input = options.input;
    // 状态机初始化
    this.init();
  }
  // 状态机初始化方法
  init() {
    // 状态机初始化输入
    this.dataInit();
  }
  // 初始化输入方法
  dataInit() {
    // 输出
    const outputData: outputDataType = {};
    const modelsDefine = this.stateInfo.config.funcDefine;
    modelsDefine &&
      modelsDefine.forEach((model) => {
        // 获取model的json
        const json = model.json;
        if (!(json in { ...this.input, ...outputData })) {
          // 获取默认status的value
          const value = model.statusDefine.default.value;
          // 设置进对应的json里面
          outputData[json] = Number(value) || 0;
        }
      });
    this.outputHandler.$_fn({ data: outputData, type: 'init' });
  }
  // 更新状态机输入方法
  inputHandler(newInput: undefined | inputDataType) {
    if (newInput) {
      this.input = {
        ...this.input,
        ...newInput
      };
      this.stateInfo.updateInput(newInput);
    }
  }
  // 功能模块更新到下一状态
  nextStatus(identifier: string) {
    identifier;
  }
  // 功能模块更新到指定状态
  toStatus(identifier: string) {
    identifier;
  }
}

export function machineInit(Vue: any, options: optionsType): void {
  if (Vue.prototype) {
    Vue.prototype.$fsmVue = new Fsm(options);
  } else {
    Vue.provide('$fsmVue', new Fsm(options));
  }
}
