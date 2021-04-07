import { handlerType, outputType } from '@/interfaces';
import { OutputHandlerType } from '@/interfaces/class';

export class OutputHandler implements OutputHandlerType {
  // 状态机输输出
  output: undefined | outputType;
  // 最终输出函数
  $_fn: handlerType;
  constructor(fn: handlerType) {
    this.$_fn = fn;
  }
}
