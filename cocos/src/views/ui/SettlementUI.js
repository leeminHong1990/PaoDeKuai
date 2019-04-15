// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var SettlementUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/SettlementUI.json";
        this.player_num = 4;
    },
    initUI: function () {

        this.update_player_num();

        var player = h1global.entityManager.player();
        var self = this;
        var confirm_btn = this.rootUINode.getChildByName("settlement_panel").getChildByName("confirm_btn");

        function confirm_btn_event(sender, eventType) {
            if (eventType == ccui.Widget.TOUCH_ENDED) {
                self.hide();
                if (player.curGameRoom.isPlayingGame === 0){
                    player.curGameRoom.updatePlayerState(player.serverSeatNum, 1);
                    h1global.curUIMgr.gameroomprepare_ui.show();
                    h1global.curUIMgr.gameroom_ui.hide();
                    player.roundEndCallback();
                }
            }
        }

        confirm_btn.addTouchEventListener(confirm_btn_event);

        var settlement_panel = this.rootUINode.getChildByName("settlement_panel");
        var settlement_bg_panel = this.rootUINode.getChildByName("settlement_bg_panel");
        var show_btn = this.rootUINode.getChildByName("show_btn");
        var hide_btn = this.rootUINode.getChildByName("hide_btn");
        show_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType == ccui.Widget.TOUCH_ENDED) {
                show_btn.setVisible(false);
                hide_btn.setVisible(true);
                settlement_panel.setVisible(true);
                settlement_bg_panel.setVisible(true);
            }
        });
        show_btn.setVisible(false);
        hide_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType == ccui.Widget.TOUCH_ENDED) {
                show_btn.setVisible(true);
                hide_btn.setVisible(false);
                settlement_panel.setVisible(false);
                settlement_bg_panel.setVisible(false);
            }
        });

    },

    update_player_num:function(){
        this.player_panels = [];
        for (var i = 0 ; i < this.player_num ;i++){
            this.player_panels.push(this.rootUINode.getChildByName("settlement_panel").getChildByName("player_info_panel_"+i.toString()));
        }
        // 更改位置
        if (this.player_num == 2 ){
            this.rootUINode.getChildByName("settlement_panel").getChildByName("player_info_panel_2").setVisible(false);
            this.rootUINode.getChildByName("settlement_panel").getChildByName("player_info_panel_3").setVisible(false);
        }else if (this.player_num == 3){
            this.rootUINode.getChildByName("settlement_panel").getChildByName("player_info_panel_3").setVisible(false);
        }
    },
    show_by_info: function (roundRoomInfo, confirm_btn_func) {
        cc.log("结算==========>:");
        cc.log("roundRoomInfo", roundRoomInfo);
        var self = this;
        var playerList = roundRoomInfo["player_info_list"];
        if (playerList){
            this.player_num = playerList.length;
        }
        this.show(function () {
            var playerInfoList = roundRoomInfo["player_info_list"];
            for (var i = 0; i < playerInfoList.length; i++) {
                var roundPlayerInfo = playerInfoList[i];
                self.update_player_info(roundPlayerInfo["idx"]);
                self.update_score(roundPlayerInfo["idx"], roundPlayerInfo["score"],roundPlayerInfo["surplus_cards"],roundPlayerInfo["bomb_times"],roundRoomInfo["hong_idx"]);
            }

            self.show_title(roundRoomInfo["win_idx"]);
            //self.show_dealer(roundRoomInfo["dealer_idx"]);
            self.show_game_info(roundRoomInfo);

            if (confirm_btn_func) {
                self.rootUINode.getChildByName("settlement_panel").getChildByName("confirm_btn").addTouchEventListener(function (sender, eventType) {
                    if (eventType == ccui.Widget.TOUCH_ENDED) {
                        self.hide();
                        confirm_btn_func();
                    }
                });
            }
        });
    },

    show_title: function (win_idx) {
        var serverSeatNum = h1global.entityManager.player().serverSeatNum;
        var title_img = this.rootUINode.getChildByName("settlement_panel").getChildByName("title_img");
        title_img.ignoreContentAdaptWithSize(true);

        var bg_img = this.rootUINode.getChildByName("settlement_panel").getChildByName("bg_img");
        bg_img.ignoreContentAdaptWithSize(true);
        var win_light = this.rootUINode.getChildByName("settlement_panel").getChildByName("effects_aperture");
        if (win_idx == serverSeatNum) {
            title_img.loadTexture("res/ui/SettlementUI/win_title.png");
            bg_img.loadTexture("res/ui/SettlementUI/win_bg.png");

            win_light.setVisible(true);
            win_light.runAction(cc.rotateBy(1,120).repeatForever());
            this.runAction(cc.Sequence.create(cc.DelayTime.create(1.0), cc.CallFunc.create(function () {
                cc.audioEngine.playEffect("res/sound/voice/Nomal/win.mp3")
            })));

            this.play_fireworks_action();

        } else {
            win_light.setVisible(false);
            title_img.loadTexture("res/ui/SettlementUI/fail_title.png");
            bg_img.loadTexture("res/ui/SettlementUI/fail_bg.png");
            this.runAction(cc.Sequence.create(cc.DelayTime.create(1.0), cc.CallFunc.create(function () {
                cc.audioEngine.playEffect("res/sound/voice/Nomal/lose.mp3")
            })))
        }
    },

    show_dealer: function (dealerIdx) {
        return;
        if(dealerIdx < 0 || dealerIdx > 2){
            return;
        }
        var player_info_panel = this.rootUINode.getChildByName("settlement_panel").getChildByName("player_info_panel" + dealerIdx);
        var dealer_img = player_info_panel.getChildByName("dealer_img");
        dealer_img.setVisible(true);
        player_info_panel.reorderChild(dealer_img, 99);
    },

    fireworks_action: function (node, sprite, dalayTime, pos, scale) {
        sprite.setBlendFunc(cc.ONE,cc.ONE_MINUS_SRC_ALPHA);
        sprite.setPosition(pos);
        sprite.runAction(cc.Sequence.create(
            cc.delayTime(dalayTime),
            UICommonWidget.create_effect_action({"FRAMENUM": 8, "TIME": 0.5, "NAME": "Effects/fireworks_0000"}),
            cc.callFunc(function () {
                sprite.removeFromParent();
            })
        ));
        sprite.setScale(scale);
        node.addChild(sprite);
        node.reorderChild(sprite, 101);
    },
    play_fireworks_action: function () {
        cc.log("play_fireworks_action");
        var settlement_panel = ccui.helper.seekWidgetByName(this.rootUINode, "settlement_panel");

        UICommonWidget.load_effect_plist("fireworks");
        var settlement_fireworks_sprite1 = cc.Sprite.create();
        var settlement_fireworks_sprite2 = cc.Sprite.create();
        var settlement_fireworks_sprite3 = cc.Sprite.create();
        var settlement_fireworks_sprite4 = cc.Sprite.create();
        var settlement_fireworks_sprite5 = cc.Sprite.create();
        var settlement_fireworks_sprite6 = cc.Sprite.create();
        var settlement_fireworks_sprite7 = cc.Sprite.create();
        var settlement_fireworks_sprite8 = cc.Sprite.create();

        var settlement_fireworks_sprite1_pos = cc.p(settlement_panel.getContentSize().width * 0.25, settlement_panel.getContentSize().height * 0.8);
        var settlement_fireworks_sprite2_pos = cc.p(settlement_panel.getContentSize().width * 0.3, settlement_panel.getContentSize().height * 1);
        var settlement_fireworks_sprite3_pos = cc.p(settlement_panel.getContentSize().width * 0.55, settlement_panel.getContentSize().height * 0.9);
        var settlement_fireworks_sprite4_pos = cc.p(settlement_panel.getContentSize().width * 0.75, settlement_panel.getContentSize().height * 0.95);
        var settlement_fireworks_sprite5_pos = cc.p(settlement_panel.getContentSize().width * 0.25, settlement_panel.getContentSize().height * 0.8);
        var settlement_fireworks_sprite6_pos = cc.p(settlement_panel.getContentSize().width * 0.3, settlement_panel.getContentSize().height * 1);
        var settlement_fireworks_sprite7_pos = cc.p(settlement_panel.getContentSize().width * 0.55, settlement_panel.getContentSize().height * 0.9);
        var settlement_fireworks_sprite8_pos = cc.p(settlement_panel.getContentSize().width * 0.75, settlement_panel.getContentSize().height * 0.95);
        //fireworks_action参数依次是  要绑定的父节点、要执行的sprite、延迟时间、位置、放大倍数
        this.fireworks_action(settlement_panel, settlement_fireworks_sprite1, 0.2, settlement_fireworks_sprite1_pos, 1.5);
        this.fireworks_action(settlement_panel, settlement_fireworks_sprite2, 0.6, settlement_fireworks_sprite2_pos, 1);
        this.fireworks_action(settlement_panel, settlement_fireworks_sprite3, 0.4, settlement_fireworks_sprite3_pos, 1.4);
        this.fireworks_action(settlement_panel, settlement_fireworks_sprite4, 0.8, settlement_fireworks_sprite4_pos, 1.5);
        this.fireworks_action(settlement_panel, settlement_fireworks_sprite5, 1.5, settlement_fireworks_sprite5_pos, 1.5);
        this.fireworks_action(settlement_panel, settlement_fireworks_sprite6, 1.9, settlement_fireworks_sprite6_pos, 1);
        this.fireworks_action(settlement_panel, settlement_fireworks_sprite7, 1.7, settlement_fireworks_sprite7_pos, 1.4);
        this.fireworks_action(settlement_panel, settlement_fireworks_sprite8, 2.1, settlement_fireworks_sprite8_pos, 1.5);
    },
    update_player_info: function (serverSeatNum) {
        if (!this.is_show) {
            return;
        }
        var player = h1global.entityManager.player();
        var cur_player_info_panel = this.player_panels[serverSeatNum];
        cc.log("cur_player_info_panel: " + cur_player_info_panel);
        if (!cur_player_info_panel) {
            return;
        }
        var playerInfo = player.curGameRoom.playerInfoList[serverSeatNum];
        cur_player_info_panel.getChildByName("name_label").setString(playerInfo["nickname"]);
        //var frame_img = ccui.helper.seekWidgetByName(cur_player_info_panel, "frame_img");
        //cur_player_info_panel.reorderChild(frame_img, 1);
/*        cutil.loadPortraitTexture(playerInfo["head_icon"], function (img) {
            cur_player_info_panel.getChildByName("portrait_sprite").removeFromParent();
            var portrait_sprite = new cc.Sprite(img);
            portrait_sprite.setName("portrait_sprite");
            portrait_sprite.setScale(86 / portrait_sprite.getContentSize().width);
            portrait_sprite.x = cur_player_info_panel.getContentSize().width * 0.5;
            portrait_sprite.y = cur_player_info_panel.getContentSize().height * 0.5;
            cur_player_info_panel.addChild(portrait_sprite);
            portrait_sprite.setLocalZOrder(-1);
            frame_img.setLocalZOrder(0);
        }, playerInfo["uuid"].toString() + ".png");*/

/*        var idx = playerInfo["idx"];
        if (idx == player.curGameRoom.ownerId) {
            var owner_img = cur_player_info_panel.getChildByName("owner_img");
            owner_img.setVisible(false);  //若要显示，置为true
            this.player_panels[serverSeatNum].reorderChild(owner_img, 2);
        } else {
            this.player_panels[serverSeatNum].getChildByName("owner_img").setVisible(false);
        }*/

    },

    update_score: function (serverSeatNum, score,surplus_cards,bomb_times,hong_ten_flag) {
        var score_label = this.player_panels[serverSeatNum].getChildByName("score_label");
        var bomb_label = this.player_panels[serverSeatNum].getChildByName("bomb_label");
        var surplus_label = this.player_panels[serverSeatNum].getChildByName("surplus_label");
        if (score >= 0) {
            //score_label.setTextColor(cc.color(62, 121, 77));
            score_label.setString("+" + score.toString());
        } else {
            //score_label.setTextColor(cc.color(144, 71, 64));
            score_label.setString(score.toString());
        }
        bomb_label.setString(bomb_times.toString());
        surplus_label.setString(surplus_cards.toString());
        if (hong_ten_flag >= 0){
            this.player_panels[hong_ten_flag].getChildByName("hong_ten_img").setVisible(true);
        }
    },

    show_game_info: function (info) {
        return;
        var this_info_panel = this.rootUINode.getChildByName("settlement_panel").getChildByName("this_info_panel");
        var no_game_2 = this_info_panel.getChildByName("no_game_2");
        no_game_2.setString(info["current_round"]);
        no_game_2.setVisible(true);
    },

});