// cc.loader.loadJs("src/views/uimanager/LoginSceneUIManager.js")

var ArenaScene = cc.Scene.extend({
    className: "ArenaScene",
    onEnter: function () {
        this._super();
        this.loadUIManager();
        cutil.unlock_ui();

        if (cc.audioEngine.isMusicPlaying()) {
            cc.audioEngine.stopMusic();
        }
        if(!cc.audioEngine.isMusicPlaying()){
            cc.audioEngine.playMusic("res/sound/music/sound_bgm.mp3", true);
        }
        cutil.getSportInfoList();
    },

    loadUIManager: function () {
        var curUIManager = new ArenaSceneUIManager();
        curUIManager.setAnchorPoint(0, 0);
        curUIManager.setPosition(0, 0);
        this.addChild(curUIManager, const_val.curUIMgrZOrder);
        h1global.curUIMgr = curUIManager;
        curUIManager.arena_ui.show();

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
