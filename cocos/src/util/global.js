"use strict";

var h1global = function(){
    this.ctor();
};

h1global.loginType = const_val.LOGIN_TYPE_NONE

h1global.clientVersions = {}
h1global.clientVersions[const_val.RankType_Wealth] = 1
h1global.clientVersions[const_val.RankType_Charm] = 1
h1global.clientVersions[const_val.RankType_Week_Killing] = 1
h1global.clientVersions[const_val.RankType_Week_MasterPoint] = 1

h1global.ctor = function() {
    this.curUIMgr = undefined
    this.curScene = undefined
    this.globalUIMgr = undefined
    this.entityManager = undefined
    this.mainResFinish = false;
    this.enterMainScene = false;
    this.reconnect = false;
};

h1global.initKBEngine = function() {
    // 初始化KBEngine
    var args = new KBEngine.KBEngineArgs();
    
    // 设置登录ip地址
    args.ip = switches.kbeServerIP;
    args.port = switches.kbeServerLoginPort;
    KBEngine.create(args);

    this.entityManager = KBEngine.app;
};

h1global.destroyKBEngine = function() {
    KBEngine.destroy();
};


h1global.performWithDelay = function(node, callback, delay){
    var delay = cc.DelayTime.create(delay);
    var sequence = cc.Sequence.create(delay, cc.CallFunc.create(callback));
    node.runAction(sequence);
    return sequence;
};

h1global.runScene = function(scene){
    // added by LZR
    if (!onhookMgr) { 
        onhookMgr = new OnHookManager();
    }
    if (h1global.globalUIMgr) {
        h1global.globalUIMgr.retain();
        h1global.globalUIMgr.removeFromParent(false);
    }

    cc.director.runScene(scene);
    h1global.curScene = scene;
    // added by LZR
    if(!h1global.globalUIMgr) {
        h1global.globalUIMgr = new GlobalUIManager();
        h1global.globalUIMgr.retain();
    }
    scene.addChild(h1global.globalUIMgr, const_val.globalUIMgrZOrder);
    h1global.globalUIMgr.release();
};
