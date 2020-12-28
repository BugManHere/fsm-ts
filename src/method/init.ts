import { EventQueue } from './queue';

interface optionsType {
  config: Object;
  input: Object;
  output: Object;
  customize: Object;
}

class Fsm {
  config: object = {};
  input: undefined | object;
  firstInput: Boolean = false;
  stateQueue: any;
  constructor(options: optionsType) {
    // 给状态机赋值
    this.config = options.config;
    this.updateInput(options.input);
    // 创建事件队列
    this.stateQueue = new EventQueue();
  }
  updateInput(newInput: object | undefined) {
    if (this.input || (this.input = newInput)) {
      // 初始化状态机数据
      initData();
    }
    this.input = newInput;
  }
  getOutput() {
    return {};
  }
}

export function machineInit(Vue: any, options: optionsType): void {
  if (Vue.prototype) {
    Vue.prototype.$fsmVue = new Fsm(options);
  } else {
    Vue.provide('$fsmVue', new Fsm(options));
  }
}

function initData(): void {}
