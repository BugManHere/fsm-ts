"use strict";
exports.__esModule = true;
exports.machineInit = void 0;
var queue_1 = require("./queue");
var Fsm = /** @class */ (function () {
    function Fsm(options) {
        this.config = {};
        this.firstInput = false;
        // 给状态机赋值
        this.config = options.config;
        this.updateInput(options.input);
        // 创建事件队列
        this.stateQueue = new queue_1.EventQueue();
    }
    Fsm.prototype.updateInput = function (newInput) {
        if (this.input || (this.input = newInput)) {
            // 初始化状态机数据
            initData();
        }
        this.input = newInput;
    };
    Fsm.prototype.getOutput = function () {
        return {};
    };
    return Fsm;
}());
function machineInit(Vue, options) {
    if (Vue.prototype) {
        Vue.prototype.$fsmVue = new Fsm(options);
    }
    else {
        Vue.provide('$fsmVue', new Fsm(options));
    }
}
exports.machineInit = machineInit;
function initData() { }
