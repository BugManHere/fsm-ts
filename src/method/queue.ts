export class EventQueue {
  constructor() {
    // 创建事件队列
    creatQueue(this);
    // 初始化状态机数据
  }
}

// 创建事件队列
function creatQueue(that: any): void {
  let queue: any[] = [];
  Object.defineProperty(that, '$_enentQueue', {
    // 改写getter方法
    get() {
      // setTimeout把方法放到下一个宏任务，保证队列更新
      setTimeout(() => {
        // 如果队列中存在事件，则执行
        queue.length;
      }, 0);
      return queue;
    },
    // 改写setter方法
    set(newVal) {
      queue = newVal;
    }
  });
  that.$_enentQueue = queue;
}
