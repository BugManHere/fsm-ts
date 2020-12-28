// import { createApp, computed, watchEffect } from 'vue';
import { machineInit } from './method/init';

const install = function (Vue: any, options: any) {
  machineInit(Vue, options);
};

export default { install };
