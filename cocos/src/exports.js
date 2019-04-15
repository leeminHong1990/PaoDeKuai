"use strict";
var serverconfig = function () {
};

var targetPlatform = 0; //cc.Application.getInstance().getTargetPlatform();

var g_version_mode = 0; // 0: debug, 1, shipping, 2, publish

var onhookMgr = undefined;