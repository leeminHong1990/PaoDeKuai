// cc.loader.loadJs("src/views/uimanager/LoginSceneUIManager.js")

var GameHallScene = cc.Scene.extend({
    className: "GameHallScene",
    onEnter: function () {
        this._super();
        this.loadUIManager();
        cutil.unlock_ui();
        cutil.initMusicAndEffect("res/sound/music/sound_bgm.mp3");

        if(!((cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) || (cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative) || switches.TEST_OPTION)){
            wx.onMenuShareAppMessage({
                title: '跑得快', // 分享标题
                desc: '访问公众号【' + switches.gzh_name + '】更多好玩的游戏等着你~', // 分享描述
                link: switches.h5entrylink, // 分享链接
                imgUrl: '', // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareTimeline({
                title: '跑得快', // 分享标题
                desc: '访问公众号【' + switches.gzh_name + '】更多好玩的游戏等着你~', // 分享描述
                link: switches.h5entrylink, // 分享链接
                imgUrl: '', // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
        }
    },

    loadUIManager: function () {
        var curUIManager = new GameHallSceneUIManager();
        curUIManager.setAnchorPoint(0, 0);
        curUIManager.setPosition(0, 0);
        this.addChild(curUIManager, const_val.curUIMgrZOrder);
        h1global.curUIMgr = curUIManager;

        // curUIManager.gamehall_ui.show(function(){
        //     if(h1global.reconnect){
        //         h1global.reconnect = false;
        //         h1global.runScene(new GameRoomScene());
        //     }
        // });
        curUIManager.gamehall_ui.show();

        if (!onhookMgr) {
            onhookMgr = new OnHookManager();
        }

        onhookMgr.init(this);
        this.scheduleUpdateWithPriority(0);
    },

    update: function (delta) {
        onhookMgr.update(delta);
    }
});
