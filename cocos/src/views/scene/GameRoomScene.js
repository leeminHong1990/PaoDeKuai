// cc.loader.loadJs("src/views/uimanager/LoginSceneUIManager.js")

var GameRoomScene = cc.Scene.extend({
    className: "GameRoomScene",
    onEnter: function () {
        this._super();
        this.bg_img = undefined;
        this.bg_desc_img = undefined;
        // cc.log("MainScene::loadUIManager")
        this.loadUIManager();
        cutil.unlock_ui();
        cutil.initMusicAndEffect("res/sound/music/game_bgm.mp3");
    },

    loadUIManager: function () {
        // 背景图
        this.bg_img = ccui.ImageView.create(res.gamebg_png_1);
        this.bg_img.setAnchorPoint(0.5, 0.5);
        this.bg_img.setName("bg_img");
        // bg_img.setPositionType(ccui.Widget.POSITION_PERCENT);
        // bg_img.setPositionPercent(cc.p(0.5, 0.5));
        this.bg_img.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.5));
        this.addChild(this.bg_img);
        this.bg_desc_img = ccui.ImageView.create(res.gamebg_label_png_1);
        this.bg_desc_img.setAnchorPoint(0.5, 0.5);
        this.bg_desc_img.setName("bg_desc");
        this.bg_desc_img.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.6));
        this.addChild(this.bg_desc_img);
        var bg_img_content_size = this.bg_img.getContentSize();
        var scale = cc.winSize.width / bg_img_content_size.width;
        if (cc.winSize.height / bg_img_content_size.height > scale) {
            scale = cc.winSize.height / bg_img_content_size.height;
        }
        this.bg_img.setScale(scale);

        //标签
        this.bg_txt = new cc.LabelTTF("默认值", "Arial", 26);
        this.bg_txt.setAnchorPoint(0.5, 0.5);
        this.bg_txt.setDimensions(770, 150);
        this.bg_txt.setName("bg_txt");
        this.bg_txt.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.68));
        this.bg_txt.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.bg_txt.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        this.addChild(this.bg_txt);

        var ui_style = cc.sys.localStorage.getItem("UI_STYLE_MODE") ? cc.sys.localStorage.getItem("UI_STYLE_MODE") : 0;
        this.update_ui_style(ui_style);
        // var bg_img_content_size = bg_img.getContentSize();
        // var scale = cc.winSize.width/bg_img_content_size.width;
        // if (cc.winSize.height/bg_img_content_size.height > scale){
        //     scale = cc.winSize.height/bg_img_content_size.height;
        // }
        // bg_img.setScale(scale);
        // bg_img.setScale9Enabled(true);
        // bg_img.setCapInsets(cc.Rect(100, 100, 359, 261));
        // bg_img.setContentSize(cc.winSize);

        // var bg_img1 = ccui.ImageView.create("res/ui/GameRoomUI/gameroom_corner.png");
        // bg_img1.setAnchorPoint(0.5, 0.5);
        // bg_img1.setName("bg_img1");
        // bg_img1.setPositionType(ccui.Widget.POSITION_PERCENT);
        // bg_img1.setPositionPercent(cc.p(0.1, 0.8));
        // bg_img1.setRotation(0);
        // this.addChild(bg_img1);
        // var bg_img2 = ccui.ImageView.create("res/ui/GameRoomUI/gameroom_corner.png");
        // bg_img2.setAnchorPoint(0.5, 0.5);
        // bg_img2.setName("bg_img2");
        // bg_img2.setPositionType(ccui.Widget.POSITION_PERCENT);
        // bg_img2.setPositionPercent(cc.p(0.9, 0.8));
        // bg_img2.setRotation(90);
        // this.addChild(bg_img2);
        // var bg_img3 = ccui.ImageView.create("res/ui/GameRoomUI/gameroom_corner.png");
        // bg_img3.setAnchorPoint(0.5, 0.5);
        // bg_img3.setName("bg_img3");
        // bg_img3.setPositionType(ccui.Widget.POSITION_PERCENT);
        // bg_img3.setPositionPercent(cc.p(0.9, 0.2));
        // bg_img3.setRotation(180);
        // this.addChild(bg_img3);
        // var bg_img4 = ccui.ImageView.create("res/ui/GameRoomUI/gameroom_corner.png");
        // bg_img4.setAnchorPoint(0.5, 0.5);
        // bg_img4.setName("bg_img4");
        // bg_img4.setPositionType(ccui.Widget.POSITION_PERCENT);
        // bg_img4.setPositionPercent(cc.p(0.1, 0.2));
        // bg_img4.setRotation(270);
        // this.addChild(bg_img4);

        // var centre_img1 = ccui.ImageView.create("res/ui/GameRoomUI/gameroom_bg_centre.png");
        // centre_img1.setAnchorPoint(0.5, 0.5);
        // centre_img1.setName("centre_img1");
        // // centre_img1.setPositionType(ccui.Widget.POSITION_PERCENT);
        // // centre_img1.setPositionPercent(cc.p(0.5, 0.5));
        // centre_img1.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.6 - 35));
        // centre_img1.setScale(0.7);
        // this.addChild(centre_img1);
        // var centre_img2 = ccui.ImageView.create("res/ui/GameRoomUI/gameroom_bg_centre.png");
        // centre_img2.setAnchorPoint(1.0, 0.5);
        // centre_img2.setName("centre_img2");
        // centre_img2.setPositionType(ccui.Widget.POSITION_PERCENT);
        // centre_img2.setPositionPercent(cc.p(0.5, 0.5));
        // centre_img2.setFlippedX(true);
        // this.addChild(centre_img2);

        // var logo_img = ccui.ImageView.create("res/ui/GameRoomUI/gameroom_logo.png");
        // logo_img.setAnchorPoint(0.5, 0.5);
        // logo_img.setName("logo_img");
        // // logo_img.setPositionType(ccui.Widget.POSITION_PERCENT);
        // // logo_img.setPositionPercent(cc.p(0.5, 0.7));
        // // logo_img.setScale(3.0);
        // logo_img.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.8));
        // this.addChild(logo_img);

        var curUIManager = new GameRoomSceneUIManager();
        curUIManager.setAnchorPoint(0, 0);
        curUIManager.setPosition(0, 0);
        this.addChild(curUIManager, const_val.curUIMgrZOrder);
        h1global.curUIMgr = curUIManager;
        // curUIManager.gameroom_ui.show();
        var player = h1global.entityManager.player();
        cc.log("isPlayingGame ########################## : ", h1global.entityManager.player().curGameRoom.isPlayingGame);
        if (h1global.entityManager.player().curGameRoom.isPlayingGame) {
            curUIManager.settlement_ui.hide();
            curUIManager.gameroomprepare_ui.hide();
            if (h1global.entityManager.player().isPlayingStartAnimation) {
                curUIManager.gameroom_ui.show(function () {
                    h1global.curUIMgr.gameroom_ui.startBeginAnim(player.diceList, player.curGameRoom.dealerIdx);
                });
            } else {
                curUIManager.gameroom_ui.show(function () {
                });
            }
        } else {
            curUIManager.gameroom_ui.hide();
            curUIManager.settlement_ui.hide();
            curUIManager.gameroomprepare_ui.show();
        }


        if (!onhookMgr) {
            onhookMgr = new OnHookManager();
        }

        onhookMgr.init(this);
        this.scheduleUpdateWithPriority(0);

        if (onhookMgr.applyCloseLeftTime > 0) {
            curUIManager.applyclose_ui.show_by_sitnum(h1global.entityManager.player().curGameRoom.applyCloseFrom);
        }
    },

    update: function (delta) {
        // if (physicsUpdate) {
        //     physicsUpdate();
        // }
        onhookMgr.update(delta);
    },
    update_ui_style: function (ui_style) {
        var self = this;
        if (h1global.curScene.bg_img && h1global.curScene.bg_desc_img) {
            if (0 == ui_style) {
                h1global.curScene.bg_txt.setColor(cc.color(33, 75, 95));
                h1global.curScene.bg_img.loadTexture(res.gamebg_png_1, ccui.Widget.LOCAL_TEXTURE);
                h1global.curScene.bg_desc_img.loadTexture(res.gamebg_label_png_1, ccui.Widget.LOCAL_TEXTURE);
            } else if (1 == ui_style) {
                h1global.curScene.bg_txt.setColor(cc.color(46, 95, 70));
                h1global.curScene.bg_img.loadTexture(res.gamebg_png_2, ccui.Widget.LOCAL_TEXTURE);
                h1global.curScene.bg_desc_img.loadTexture(res.gamebg_label_png_2, ccui.Widget.LOCAL_TEXTURE);
            } else if (2 == ui_style) {
                h1global.curScene.bg_txt.setColor(cc.color(119, 95, 81));
                h1global.curScene.bg_img.loadTexture(res.gamebg_png_3, ccui.Widget.LOCAL_TEXTURE);
                h1global.curScene.bg_desc_img.loadTexture(res.gamebg_label_png_3, ccui.Widget.LOCAL_TEXTURE);
            }
        }
    },
});