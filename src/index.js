"use strict";
exports.__esModule = true;
// import { createApp, computed, watchEffect } from 'vue';
var init_1 = require("./method/init");
var install = function (Vue, options) {
    init_1.machineInit(Vue, options);
};
exports["default"] = { install: install };
