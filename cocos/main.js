/**
 * A brief explanation for "project.json":
 * Here is the content of project.json file, this is the global configuration for your game, you can modify it to customize some behavior.
 * The detail of each field is under it.
 {
    "project_type": "javascript",
    // "project_type" indicate the program language of your project, you can ignore this field

    "debugMode"     : 1,
    // "debugMode" possible values :
    //      0 - No message will be printed.
    //      1 - cc.error, cc.assert, cc.warn, cc.log will print in console.
    //      2 - cc.error, cc.assert, cc.warn will print in console.
    //      3 - cc.error, cc.assert will print in console.
    //      4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.
    //      5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.
    //      6 - cc.error, cc.assert will print on canvas, available only on web.

    "showFPS"       : true,
    // Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.

    "frameRate"     : 60,
    // "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.

    "noCache"       : false,
    // "noCache" set whether your resources will be loaded with a timestamp suffix in the url.
    // In this way, your resources will be force updated even if the browser holds a cache of it.
    // It's very useful for mobile browser debuging.

    "id"            : "gameCanvas",
    // "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.

    "renderMode"    : 0,
    // "renderMode" sets the renderer type, only useful on web :
    //      0 - Automatically chosen by engine
    //      1 - Forced to use canvas renderer
    //      2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers

    "engineDir"     : "frameworks/cocos2d-html5/",
    // In debug mode, if you use the whole engine to develop your game, you should specify its relative path with "engineDir",
    // but if you are using a single engine file, you can ignore it.

    "modules"       : ["cocos2d"],
    // "modules" defines which modules you will need in your game, it's useful only on web,
    // using this can greatly reduce your game's resource size, and the cocos console tool can package your game with only the modules you set.
    // For details about modules definitions, you can refer to "../../frameworks/cocos2d-html5/modulesConfig.json".

    "jsList"        : [
    ]
    // "jsList" sets the list of js files in your game.
 }
 *
 */

cc.game.onStart = function () {
    cc.log("onStart!");

    // init KBE
    h1global.initKBEngine();

    // init GlobalUIManager
    h1global.globalUIMgr = new GlobalUIManager();
    h1global.globalUIMgr.retain();

    // If referenced loading.js, please remove it
    if (!cc.sys.isNative && document.getElementById("cocosLoading")) {
        document.body.removeChild(document.getElementById("cocosLoading"));
    }

    // Pass true to enable retina display, on Android disabled by default to improve performance
    cc.view.enableRetina(true);
    // cc.view.enableRetina(cc.sys.os === cc.sys.OS_IOS ? true : false);
    // Adjust viewport meta
    cc.view.adjustViewPort(true);
    // Setup the resolution policy and design resolution size
    // cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.SHOW_ALL);
    // cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.FIXED_HEIGHT);
    if (cc.sys.os === cc.sys.OS_IOS || cc.sys.os === cc.sys.OS_ANDROID) {
        cc.view.setOrientation(cc.ORIENTATION_LANDSCAPE);
        function onScreenResize() {
            var width = cc.view.getFrameSize().width;
            var height = cc.view.getFrameSize().height;
            if(width < height){
                width = cc.view.getFrameSize().height;
                height = cc.view.getFrameSize().width;
            }
            if (width / height < 1.778) {
                cc.view.setDesignResolutionSize(1280, height / width * 1280, cc.ResolutionPolicy.SHOW_ALL);
            } else {
                cc.view.setDesignResolutionSize(width / height * 720, 720, cc.ResolutionPolicy.SHOW_ALL);
            }
            // cc.director.getRunningScene().onScreenResize();
        }

        cc.view.setResizeCallback(onScreenResize);
        onScreenResize();
    } else {
        cc.view.setDesignResolutionSize(1280, 720, cc.ResolutionPolicy.SHOW_ALL);
    }
    // Instead of set design resolution, you can also set the real pixel resolution size
    // Uncomment the following line and delete the previous line.
    // cc.view.setRealPixelResolution(960, 640, cc.ResolutionPolicy.SHOW_ALL);
    // The game will be resized when browser size change
    cc.view.resizeWithBrowserSize(true);

    // set music and effect
    if (cc.sys.localStorage.getItem("MUSIC_VOLUME") === null) {
        cc.sys.localStorage.setItem("MUSIC_VOLUME", 50);
    }
    if (cc.sys.localStorage.getItem("EFFECT_VOLUME") === null) {
        cc.sys.localStorage.setItem("EFFECT_VOLUME", 50);
    }
    cc.audioEngine.setMusicVolume(cc.sys.localStorage.getItem("MUSIC_VOLUME") * 0.01);
    cc.audioEngine.setEffectsVolume(cc.sys.localStorage.getItem("EFFECT_VOLUME") * 0.01);

    cc.LoaderScene.preload(g_resources, function () {
        if((cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) || (cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative) || switches.TEST_OPTION){
            h1global.runScene(new LoginScene());
        } else {
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.open("GET", switches.PHP_SERVER_URL + "/wechat/getSignPackage?url=" + encodeURIComponent(window.location.href), true);
            // cc.log("http://www.zhizunhongzhong.com/hzmgr/index.php/Wxshare/?url=" + encodeURIComponent(window.location.href))
            xhr.onreadystatechange = function(){
                if(xhr.readyState === 4 && xhr.status === 200){
                    var info_json = xhr.responseText;
                    cc.log(info_json);
                    var info_dict = eval('(' + info_json + ')');
                    wx.config({
                        // debug: true,
                        appId: info_dict["appId"],
                        timestamp: info_dict["timestamp"],
                        nonceStr: info_dict["nonceStr"],
                        signature: info_dict["signature"],
                        jsApiList: [
                            'checkJsApi',
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'hideMenuItems',
                            'showMenuItems',
                            'hideAllNonBaseMenuItem',
                            'showAllNonBaseMenuItem',
                            'translateVoice',
                            'startRecord',
                            'stopRecord',
                            'onRecordEnd',
                            'playVoice',
                            'pauseVoice',
                            'stopVoice',
                            'uploadVoice',
                            'downloadVoice',
                            'chooseImage',
                            'previewImage',
                            'uploadImage',
                            'downloadImage',
                            'getNetworkType',
                            'openLocation',
                            'getLocation',
                            'hideOptionMenu',
                            'showOptionMenu',
                            'closeWindow',
                            'scanQRCode',
                            'chooseWXPay',
                            'openProductSpecificView',
                            'addCard',
                            'chooseCard',
                            'openCard'
                        ]
                    });
                    wx.ready(function(){
                        h1global.runScene(new LoginScene());
                    });
                }
            };
            xhr.send();
        }
    }, this);
};

cc.game.onExit = function () {
    // destroy KBE
    h1global.destroyKBEngine();
};

cc.game.run();