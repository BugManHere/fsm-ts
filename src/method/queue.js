"use strict";
exports.__esModule = true;
exports.EventQueue = void 0;
var EventQueue = /** @class */ (function () {
    function EventQueue() {
        // 创建事件队列
        creatQueue(this);
        // 初始化状态机数据
    }
    return EventQueue;
}());
exports.EventQueue = EventQueue;
// 创建事件队列
function creatQueue(that) {
    var queue = [];
    Object.defineProperty(that, '$_enentQueue', {
        // 改写getter方法
        get: function () {
            // setTimeout把方法放到下一个宏任务，保证队列更新
            setTimeout(function () {
                // 如果队列中存在事件，则执行
                queue.length;
            }, 0);
            return queue;
        },
        // 改写setter方法
        set: function (newVal) {
            queue = newVal;
        }
    });
    that.$_enentQueue = queue;
}
