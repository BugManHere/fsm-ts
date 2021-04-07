import { machineInit, Fsm } from './method/init';

const install = function (Vue: any, options: any) {
  machineInit(Vue, options);
};

export default { install, FsmTs: Fsm };
