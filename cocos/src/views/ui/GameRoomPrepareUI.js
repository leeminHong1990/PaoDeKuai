var GameRoomPrepareUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/GameRoomPrepareUI.json";
    },

    initUI: function () {

        this.talk_img_num = 0;
        var player = h1global.entityManager.player();
        this.update_agent_info_panel();
        for (var i = 0; i < player.curGameRoom.playerNum; i++) {
            cc.log(player.curGameRoom.playerInfoList);
            this.update_player_info_panel(i, player.curGameRoom.playerInfoList[i]);
            if (player.curGameRoom.playerInfoList[i]) {
                this.update_player_state(i, player.curGameRoom.playerStateList[i]);
            }

        }
        var wxinvite_btn = this.rootUINode.getChildByName("wxinvite_btn");
        if ((cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative) && switches.appstore_check === true) {
            wxinvite_btn.setVisible(false);
        }
        wxinvite_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                var player_num = 0;
                for (var i = 0; i < player.curGameRoom.playerNum; i++) {
                    if (player.curGameRoom.playerInfoList[i]) {
                        player_num++;
                    }
                }
                var room_info_label = player.curGameRoom.update_room_info();
                var share_title = switches.gzh_name+' 房间号【' + player.curGameRoom.roomID.toString() + '】';
                var share_desc = '(' + player_num + '缺' + (player.curGameRoom.playerNum - player_num) + ') '+ player.curGameRoom.groupName + ' '+room_info_label + '的房间，快来一起玩吧';

                var share_url = switches.PHP_SERVER_URL + '/' + switches.package_name.split('/')[2].toLowerCase() + '_home?action=joinroom&roomId=' + player.curGameRoom.roomID.toString();
                if ((cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative)) {
                    jsb.reflection.callStaticMethod(switches.package_name + "/AppActivity", "callWechatShareUrl", "(ZLjava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", true, share_url, share_title, share_desc);
                } else if ((cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative)) {
                    jsb.reflection.callStaticMethod("WechatOcBridge", "callWechatShareUrlToSession:fromUrl:withTitle:andDescription:", true, share_url, share_title, share_desc);
                } else {
                    wx.onMenuShareAppMessage({
                        title: share_title, // 分享标题
                        desc: share_desc, // 分享描述
                        link: switches.h5entrylink, // 分享链接
                        imgUrl: '', // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            cc.log("ShareAppMessage Success!");
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                            cc.log("ShareAppMessage Cancel!");
                        },
                        fail: function () {
                            cc.log("ShareAppMessage Fail")
                        },
                    });
                    h1global.curUIMgr.share_ui.show();
                }
            }
        });
        if (h1global.entityManager.player().curGameRoom.curRound === 0) {
            if (player.curGameRoom.is_Full()) {
                if (h1global.curUIMgr.gameroomprepare_ui && h1global.curUIMgr.gameroomprepare_ui.is_show) {
                    if (player.curGameRoom.isCompetition !== 1) {
                        h1global.curUIMgr.gps_ui.show();
                    }
                }
            }
        }

        if (player.curGameRoom.isCompetition === 1 && h1global.entityManager.player().curGameRoom.curRound === 0) {
            player.curGameRoom.updatePlayerState(player.serverSeatNum, 1);
            h1global.curUIMgr.gameroomprepare_ui.update_player_state(player.serverSeatNum, 1);
            player.roundEndCallback();
        }

        // var prepare_btn = this.rootUINode.getChildByName("prepare_btn");
        // var cancel_prepare_btn = this.rootUINode.getChildByName("cancel_prepare_btn");
        // if (player.curGameRoom.isCompetition === 1) {
        //     prepare_btn.setVisible(false);
        //     cancel_prepare_btn.setVisible(false);
        //     player.curGameRoom.updatePlayerState(player.serverSeatNum, 1);
        //     h1global.curUIMgr.gameroomprepare_ui.update_player_state(player.serverSeatNum, 1);
        //     player.roundEndCallback();
        //     player.curGameRoom.IsAllPreplayerState();
        // } else {
        //     prepare_btn.addTouchEventListener(function (sender, eventType) {
        //         if (eventType === ccui.Widget.TOUCH_ENDED) {
        //             player.curGameRoom.updatePlayerState(player.serverSeatNum, 1);
        //             h1global.curUIMgr.gameroomprepare_ui.update_player_state(player.serverSeatNum, 1);
        //             player.roundEndCallback();
        //             if (!player.curGameRoom.IsAllPreplayerState()) {
        //                 prepare_btn.setVisible(false);
        //                 cancel_prepare_btn.setVisible(true);
        //             }
        //         }
        //     });
        //     cancel_prepare_btn.addTouchEventListener(function (sender, eventType) {
        //         if (eventType === ccui.Widget.TOUCH_ENDED) {
        //             player.curGameRoom.updatePlayerState(player.serverSeatNum, 0);
        //             h1global.curUIMgr.gameroomprepare_ui.update_player_state(player.serverSeatNum, 0);
        //             player.roundEndCallback();
        //             cancel_prepare_btn.setVisible(false);
        //             prepare_btn.setVisible(true);
        //         }
        //     });
        // }
        var copy_room_info_btn = this.rootUINode.getChildByName("copy_room_info_btn");
        copy_room_info_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                var player_num = 0;
                for (var i = 0; i < player.curGameRoom.playerNum; i++) {
                    if (player.curGameRoom.playerInfoList[i]) {
                        player_num++;
                    }
                }
                var roominfo = '(' + player_num + '缺' + (player.curGameRoom.playerNum - player_num) +')'+player.curGameRoom.groupName + ' ' +'房间号【' + player.curGameRoom.roomID.toString() + '】我开了' + player.curGameRoom.update_room_info() + '的房间，快来一起玩吧';
                cutil.copyToClipBoard(roominfo);
            }
        });

        if (h1global.entityManager.player().curGameRoom.curRound !== 0 || player.curGameRoom.isCompetition === 1) {
            wxinvite_btn.setVisible(false);
            copy_room_info_btn.setVisible(false);
            //cancel_prepare_btn.setVisible(false);
        }

        h1global.curUIMgr.gameroominfo_ui.show();

        if (!cc.audioEngine.isMusicPlaying()) {
            cc.audioEngine.resumeMusic();
        }
    },

    check_invition: function () {
        var player = h1global.entityManager.player();
        if (player.curGameRoom.isCompetition === 1){
            return
        }

        var playerNum = 0;
        for (var i = 0; i < player.curGameRoom.playerNum; i++) {
            if (player.curGameRoom.playerInfoList[i]) {
                playerNum = playerNum + 1;
            }
        }
        var wxinvite_btn = this.rootUINode.getChildByName("wxinvite_btn");
        var copy_room_info_btn = this.rootUINode.getChildByName("copy_room_info_btn");
        if (playerNum < player.curGameRoom.playerNum) {
            wxinvite_btn.setVisible(true);
            copy_room_info_btn.setVisible(true);
        } else {
            wxinvite_btn.setVisible(false);
            copy_room_info_btn.setVisible(false);
        }
        if ((cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative) && switches.appstore_check === true) {
            wxinvite_btn.setVisible(false);
        }
    },

    check_prepare: function () {
        return;
        var player = h1global.entityManager.player();
        var prepare_btn = this.rootUINode.getChildByName("prepare_btn");
        var cancel_prepare_btn = this.rootUINode.getChildByName("cancel_prepare_btn");
        if (player.curGameRoom.playerStateList[player.serverSeatNum]) {
            prepare_btn.setVisible(false);
            cancel_prepare_btn.setVisible(true);
        } else {
            prepare_btn.setVisible(true);
            cancel_prepare_btn.setVisible(false);
        }
    },

    //房间玩家准备的相关信息
    update_player_info_panel: function (serverSeatNum, playerInfo) {
        var player = h1global.entityManager.player();
        if (serverSeatNum < 0 || serverSeatNum > player.curGameRoom.playerNum) {
            return;
        }
        cc.log(player.server2CurSitNum(serverSeatNum));

        var player_info_panel = this.rootUINode.getChildByName("player_info_panel" + player.server2CurSitNum(serverSeatNum).toString());
        // if (player.curGameRoom.playerNum  = 4 ){
        //     if (player.server2CurSitNum(serverSeatNum) == 2){
        //         player_info_panel.setPositionX(1280*0.5);
        //         player_info_panel.setPositionY(720*0.9);
        //     }else if (player.server2CurSitNum(serverSeatNum) == 3){
        //         player_info_panel.setPositionX(1280*0.25);
        //         player_info_panel.setPositionY(720*0.7);
        // }
        // }
        if (playerInfo) {
            var name_label = ccui.helper.seekWidgetByName(player_info_panel, "name_label");
            name_label.setString(playerInfo["nickname"]);
            var frame_img = ccui.helper.seekWidgetByName(player_info_panel, "frame_img");
            player_info_panel.reorderChild(frame_img, 1);
            frame_img.setTouchEnabled(true);
            frame_img.addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    h1global.curUIMgr.gameplayerinfo_ui.show_by_info(playerInfo, player.serverSeatNum, serverSeatNum);
                }
            });
            cutil.loadPortraitTexture(playerInfo["head_icon"], function (img) {
                if (h1global.curUIMgr.gameroomprepare_ui && h1global.curUIMgr.gameroomprepare_ui.is_show && player_info_panel) {
                    player_info_panel.getChildByName("portrait_sprite").removeFromParent();
                    var portrait_sprite = new cc.Sprite(img);
                    portrait_sprite.setName("portrait_sprite");
                    portrait_sprite.setScale(86 / portrait_sprite.getContentSize().width);
                    if (player.server2CurSitNum(serverSeatNum) === 0) {
                        portrait_sprite.x = player_info_panel.getContentSize().width * 0.089;
                    } else {
                        portrait_sprite.x = player_info_panel.getContentSize().width * 0.493;
                    }
                    portrait_sprite.y = player_info_panel.getContentSize().height * 0.49;
                    player_info_panel.addChild(portrait_sprite);
                }
            }, playerInfo["uuid"].toString() + ".png");
            var score_label = ccui.helper.seekWidgetByName(player_info_panel, "score_label");
            score_label.ignoreContentAdaptWithSize(true);
            score_label.setString((player.curGameRoom.player_advance_info_list[serverSeatNum]["total_score"] || 0).toString());

            // var owner_img = ccui.helper.seekWidgetByName(player_info_panel, "owner_img");
            // player_info_panel.reorderChild(owner_img, 3);
            // if(serverSeatNum == 0){
            // 	owner_img.setVisible(false);
            // } else {
            // 	owner_img.setVisible(false);
            // }`
            player_info_panel.setVisible(true);
        } else {
            player_info_panel.setVisible(false);
        }
        this.check_invition();
        this.check_prepare();
    },

    //更新当前房间自己的信息
    update_agent_info_panel: function () {
        var player = h1global.entityManager.player();
        var curGameRoom = player.curGameRoom;
        // var playerInfo = {
        // 	"nickname" : curGameRoom.agent_nickname,
        // 	"head_icon" : curGameRoom.agent_head_icon,
        // 	"userId" : curGameRoom.agent_userId,
        // 	"uuid" : "agent_portrait"
        // }
        var playerInfo = curGameRoom.agentInfo;
        var player_info_panel = this.rootUINode.getChildByName("agent_info_panel");
        if (curGameRoom.isAgent) {
            var name_label = ccui.helper.seekWidgetByName(player_info_panel, "name_label");
            name_label.setString(playerInfo["nickname"]);
            var frame_img = ccui.helper.seekWidgetByName(player_info_panel, "frame_img");
            player_info_panel.reorderChild(frame_img, 1);
            frame_img.setTouchEnabled(false);
            // frame_img.addTouchEventListener(function(sender, eventType){
            // 	if(eventType == ccui.Widget.TOUCH_ENDED){
            // 		h1global.curUIMgr.gameplayerinfo_ui.show_by_info(playerInfo);
            // 	}
            // });
            cutil.loadPortraitTexture(playerInfo["head_icon"], function (img) {
                if (h1global.curUIMgr.gameroomprepare_ui && h1global.curUIMgr.gameroomprepare_ui.is_show && player_info_panel) {
                    player_info_panel.getChildByName("portrait_sprite").removeFromParent();
                    var portrait_sprite = new cc.Sprite(img);
                    portrait_sprite.setName("portrait_sprite");
                    portrait_sprite.setScale(81 / portrait_sprite.getContentSize().width);
                    portrait_sprite.x = player_info_panel.getContentSize().width * 0.5;
                    portrait_sprite.y = player_info_panel.getContentSize().height * 0.5;
                    player_info_panel.addChild(portrait_sprite);
                }
            }, playerInfo["uuid"].toString() + ".png");
            var userid_label = ccui.helper.seekWidgetByName(player_info_panel, "userid_label");
            userid_label.ignoreContentAdaptWithSize(true);
            userid_label.setString("ID:" + (playerInfo["userId"]).toDouble().toString());
            player_info_panel.setVisible(true);
        } else {
            player_info_panel.setVisible(false);
        }
        // this.check_invition();
    },

    update_player_state: function (serverSeatNum, state) {
        var player = h1global.entityManager.player();
        if (serverSeatNum < 0 || serverSeatNum > (player.curGameRoom.playerNum - 1)) {
            return;
        }
        var player_info_panel = this.rootUINode.getChildByName("player_info_panel" + player.server2CurSitNum(serverSeatNum).toString());
        var ready_img = ccui.helper.seekWidgetByName(player_info_panel, "ready_img");
        player_info_panel.reorderChild(ready_img, 4);
        if (state === 1) {
            // name_label.setString(playerInfo["name"]);
            ready_img.setVisible(true);
        } else {
            ready_img.setVisible(false);
        }
    },

    getMagicPos: function (deskSeat) {
        if (deskSeat < 0 || deskSeat > 3) {
            return null
        }
        var playerInfoPanel = this.rootUINode.getChildByName("player_info_panel" + deskSeat);
        if (playerInfoPanel) {
            var anchor_point = playerInfoPanel.getAnchorPoint();
            var content_size = playerInfoPanel.getContentSize();
            var cur_pos = playerInfoPanel.getPosition();
            if (deskSeat !== 0) {
                var x = cur_pos.x - content_size.width * (anchor_point.x - 0.5);
                var y = cur_pos.y - content_size.height * (anchor_point.y - 0.5);
            } else {
                var x = cur_pos.x + 45;
                var y = cur_pos.y + 62;
            }
            return cc.p(x, y);
        }
    },

    getMessagePos: function (deskSeat) {
        if (deskSeat < 0 || deskSeat > 3) {
            return null
        }
        var playerInfoPanel = this.rootUINode.getChildByName("player_info_panel" + deskSeat);
        if (playerInfoPanel) {
            var anchor_point = playerInfoPanel.getAnchorPoint();
            var content_size = playerInfoPanel.getContentSize();
            var cur_pos = playerInfoPanel.getPosition();
            if (deskSeat === 1) {
                var x = cur_pos.x - content_size.width * anchor_point.x - 110;
                var y = cur_pos.y - content_size.height * anchor_point.y + 130;
            } else if (deskSeat === 0) {
                var x = cur_pos.x - content_size.width * anchor_point.x + 130;
                var y = cur_pos.y - content_size.height * anchor_point.y + 180;
            } else if (deskSeat === 2) {
                var x = cur_pos.x - content_size.width * anchor_point.x + 230;
                var y = cur_pos.y - content_size.height * anchor_point.y + 70;
            } else {
                var x = cur_pos.x - content_size.width * anchor_point.x + 230;
                var y = cur_pos.y - content_size.height * anchor_point.y + 100;
            }
            return cc.p(x, y);
        }
    },

    update_magic: function (eid) {
        var magic = {};
        var activeTime = {};
        var anim = {};
        var position = {};
        var info_list = [];
        switch (eid) {
            case 1:
                magic = {"FRAMENUM": 15, "TIME": 1.2, "NAME": "MagicCheersUI/"};
                activeTime = {"Scalebefore": 0.6, "Scaleafter": 1.5};
                position = {"x": 0, "y": 0};
                break;
            case 2:
                magic = {"FRAMENUM": 16, "TIME": 1.6, "NAME": "MagicEgeUI/"};
                activeTime = {"Scalebefore": 0.7, "Scaleafter": 2};
                position = {"x": -25, "y": -10};
                break;
            case 3:
                magic = {"FRAMENUM": 16, "TIME": 1, "NAME": "MagicSlipperUI/"};
                activeTime = {"Scalebefore": 1, "Scaleafter": 1};
                anim = {"Rotate": 360};
                position = {"x": 0, "y": 0};
                break;
            case 4:
                magic = {"FRAMENUM": 25, "TIME": 1.8, "NAME": "MagicKissUI/"};
                activeTime = {"Scalebefore": 0.8, "Scaleafter": 1.5};
                position = {"x": 0, "y": 0};
                break;
            default:
                break;
        }
        info_list.push(magic);
        info_list.push(activeTime);
        info_list.push(anim);
        info_list.push(position);
        return info_list;
    },

    playMagicEmoAnim: function (idxFrom, idxTo, eid) {
        var self = this;
        var action = undefined;
        var player = h1global.entityManager.player();
        if (idxFrom === idxTo) {
            return
        }
        var fromPos = this.getMagicPos(player.server2CurSitNum(idxFrom));
        var toPos = this.getMagicPos(player.server2CurSitNum(idxTo));
        var magic_list = this.update_magic(eid);
        if (!magic_list) {
            return
        }
        var magic = magic_list[0];
        var magic_name = magic["NAME"].substr(0, magic["NAME"].length - 1);
        var magic_img = new ccui.ImageView();
        // 偏移量
        var dev_pos = magic_list[3];
        fromPos.x = fromPos.x + dev_pos["x"];
        fromPos.y = fromPos.y + dev_pos["y"];
        toPos.x = toPos.x + dev_pos["x"];
        toPos.y = toPos.y + dev_pos["y"];
        // 移动动画
        magic_img.loadTexture("res/ui/MagicUI/" + eid.toString() + ".png");
        magic_img.setPosition(fromPos);
        magic_img.setAnchorPoint(0.2, 0.5);
        magic_img.setScale(magic_list[1]["Scalebefore"]);
        magic_img.setLocalZOrder(10000);
        this.rootUINode.addChild(magic_img);
        if (eid === 3) {
            action = cc.spawn(
                cc.moveTo(0.6, toPos),
                cc.rotateBy(0.6, magic_list[2]["Rotate"])
            )
        } else {
            action = cc.moveTo(0.6, toPos)
        }
        magic_img.runAction(cc.sequence(
            action,
            cc.callFunc(function () {
                magic_img.removeFromParent();
                UICommonWidget.load_effect_plist(magic_name);
                var effectdice = cc.Sprite.create();
                effectdice.setScale(magic_list[1]["Scaleafter"]);
                effectdice.setPosition(toPos);
                self.rootUINode.addChild(effectdice);
                effectdice.runAction(cc.sequence(
                    UICommonWidget.create_effect_action(magic_list[0]),
                    cc.callFunc(function () {
                        effectdice.removeFromParent();
                    })
                ));
            })
        ));
        // 音效
        cc.audioEngine.playEffect("res/sound/effect/magic" + eid + ".mp3");
    },

    update_emotion_num: function (eid) {
        var info = [];
        var actioninfo = {};
        var action_num = 1;
        switch (eid) {
            case 1:
                actioninfo = {"FRAMENUM": 4, "TIME": 1, "NAME": "Emot/biaoqing_1_"};
                action_num = 2;
                break;
            case 2:
                actioninfo = {"FRAMENUM": 4, "TIME": 1, "NAME": "Emot/biaoqing_2_"};
                action_num = 2;
                break;
            case 3:
                actioninfo = {"FRAMENUM": 2, "TIME": 0.5, "NAME": "Emot/biaoqing_3_"};
                action_num = 4;
                break;
            case 4:
                actioninfo = {"FRAMENUM": 6, "TIME": 1, "NAME": "Emot/biaoqing_4_"};
                action_num = 1;
                break;
            case 5:
                actioninfo = {"FRAMENUM": 4, "TIME": 1, "NAME": "Emot/biaoqing_5_"};
                action_num = 2;
                break;
            case 6:
                actioninfo = {"FRAMENUM": 3, "TIME": 0.7, "NAME": "Emot/biaoqing_6_"};
                action_num = 3;
                break;
            case 7:
                actioninfo = {"FRAMENUM": 4, "TIME": 1, "NAME": "Emot/biaoqing_7_"};
                action_num = 1;
                break;
            case 8:
                actioninfo = {"FRAMENUM": 4, "TIME": 1, "NAME": "Emot/biaoqing_8_"};
                action_num = 2;
                break;
            case 9:
                actioninfo = {"FRAMENUM": 4, "TIME": 1, "NAME": "Emot/biaoqing_9_"};
                action_num = 2;
                break;
            default:
                break;
        }
        info.push(actioninfo);
        info.push(action_num);
        return info;
    },

    update_emotion_action: function (plist) {
        if (!plist) {
            return
        }
        var info;
        var action = plist[0];
        var action_num = plist[1];
        switch (action_num) {
            case 1:
                info = UICommonWidget.create_effect_action(action);
                break;
            case 2:
                info = cc.sequence(
                    UICommonWidget.create_effect_action(action),
                    UICommonWidget.create_effect_action(action)
                );
                break;
            case 3:
                info = cc.sequence(
                    UICommonWidget.create_effect_action(action),
                    UICommonWidget.create_effect_action(action),
                    UICommonWidget.create_effect_action(action)
                );
                break;
            case 4:
                info = cc.sequence(
                    UICommonWidget.create_effect_action(action),
                    UICommonWidget.create_effect_action(action),
                    UICommonWidget.create_effect_action(action),
                    UICommonWidget.create_effect_action(action)
                );
                break;
            default:
                break;
        }
        return info;
    },

    update_talk_bg_pos: function (talk_img, idx) {
        if (!talk_img || idx < 0) {
            return
        }
        talk_img.setAnchorPoint(cc.p(0.5, 0.5));
        if (idx === 1) {
            talk_img.loadTexture(res.communicate_bg_1);
        } else if (idx === 2 || idx === 3) {
            talk_img.loadTexture(res.communicate_bg_2);
        } else {
            talk_img.loadTexture(res.communicate_bg_0);
        }
    },

    playEmotionAnim: function (serverSeatNum, eid) {
        var deskSeat = h1global.entityManager.player().server2CurSitNum(serverSeatNum);
        var player_info_panel = this.rootUINode.getChildByName("player_info_panel" + deskSeat);
        var talk_img = ccui.ImageView.create();
        talk_img.setScale(1.0);
        talk_img.setPosition(this.getMessagePos(deskSeat));
        this.update_talk_bg_pos(talk_img, deskSeat);
        this.rootUINode.addChild(talk_img);

        UICommonWidget.load_effect_plist("biaoqing");
        var emot_sprite = cc.Sprite.create();
        emot_sprite.setScale(0.4);
        emot_sprite.setPosition(cc.p(talk_img.getContentSize().width * 0.5, talk_img.getContentSize().height * 0.5));
        emot_sprite.setAnchorPoint(cc.p(0.5, 0.5));
        talk_img.addChild(emot_sprite);

        var plist = this.update_emotion_num(eid);
        var action = this.update_emotion_action(plist);
        if (!plist || !action) {
            return
        }
        emot_sprite.runAction(
            cc.sequence(
                action,
                cc.callFunc(function () {
                    talk_img.removeFromParent();
                })
            )
        );
    },

    playMessageAnim: function (serverSeatNum, mid) {
        // var player_info_panel = this.rootUINode.getChildByName("player_info_panel" + h1global.entityManager.player().server2CurSitNum(serverSeatNum));
        var player_info_panel = undefined;
        var deskSeat = h1global.entityManager.player().server2CurSitNum(serverSeatNum);
        if (serverSeatNum < 0) {
            player_info_panel = this.rootUINode.getChildByName("agent_info_panel");
        } else {
            player_info_panel = this.rootUINode.getChildByName("player_info_panel" + deskSeat);
        }
        var talk_img = ccui.ImageView.create();
        talk_img.setScale(1.0);
        talk_img.setPosition(this.getMessagePos(deskSeat));
        this.update_talk_bg_pos(talk_img, deskSeat);
        this.rootUINode.addChild(talk_img);

        var msg_label = cc.LabelTTF.create("", "Arial", 22);
        msg_label.setDimensions(200, 0);
        msg_label.setString(const_val.MESSAGE_LIST[mid]);
        msg_label.setColor(cc.color(0, 0, 0));
        msg_label.setAnchorPoint(cc.p(0.5, 0.5));
        msg_label.setPosition(cc.p(125, 80));
        talk_img.addChild(msg_label);
        msg_label.runAction(cc.Sequence.create(cc.DelayTime.create(2.0), cc.CallFunc.create(function () {
            talk_img.removeFromParent();
        })));
    },

    playVoiceAnim: function (serverSeatNum, record_time) {
        var self = this;
        if (cc.audioEngine.isMusicPlaying()) {
            cc.audioEngine.pauseMusic();
        }
        var interval_time = 0.8;
        this.talk_img_num += 1;
        var deskSeat = h1global.entityManager.player().server2CurSitNum(serverSeatNum);
        // var player_info_panel = this.rootUINode.getChildByName("player_info_panel" + h1global.entityManager.player().server2CurSitNum(serverSeatNum));
        var player_info_panel = undefined;
        if (serverSeatNum < 0) {
            player_info_panel = this.rootUINode.getChildByName("agent_info_panel");
        } else {
            player_info_panel = this.rootUINode.getChildByName("player_info_panel" + deskSeat);
        }
        var talk_img = ccui.ImageView.create();
        // talk_img.setScale(1.0);
        talk_img.setPosition(this.getMessagePos(deskSeat));
        talk_img.loadTexture("res/ui/Default/voice_img.png");
        this.rootUINode.addChild(talk_img);
        // 加载表情图片
        // var voice_img = ccui.ImageView.create();
        // voice_img.setScale(1.0);
        // voice_img.setPosition(cc.p(134, 120));
        // voice_img.loadTexture("res/ui/GameRoomInfoUI/gameroominfo_record_btn.png");
        // talk_img.addChild(voice_img);
        var voice_img1 = ccui.ImageView.create();
        voice_img1.loadTexture("res/ui/Default/voice_img1.png");
        voice_img1.setPosition(cc.p(50, 37));
        talk_img.addChild(voice_img1);
        var voice_img2 = ccui.ImageView.create();
        voice_img2.loadTexture("res/ui/Default/voice_img2.png");
        voice_img2.setPosition(cc.p(60, 37));
        voice_img2.setVisible(false);
        talk_img.addChild(voice_img2);
        voice_img2.runAction(cc.RepeatForever.create(cc.Sequence.create(cc.DelayTime.create(interval_time), cc.CallFunc.create(function () {
            voice_img2.setVisible(true)
        }), cc.DelayTime.create(interval_time * 2), cc.CallFunc.create(function () {
            voice_img2.setVisible(false)
        }))));
        var voice_img3 = ccui.ImageView.create();
        voice_img3.loadTexture("res/ui/Default/voice_img3.png");
        voice_img3.setPosition(cc.p(70, 37));
        voice_img3.setVisible(false);
        talk_img.addChild(voice_img3);
        voice_img3.runAction(cc.RepeatForever.create(cc.Sequence.create(cc.DelayTime.create(interval_time * 2), cc.CallFunc.create(function () {
            voice_img3.setVisible(true)
        }), cc.DelayTime.create(interval_time), cc.CallFunc.create(function () {
            voice_img3.setVisible(false)
        }))));
        talk_img.runAction(cc.Sequence.create(cc.DelayTime.create(record_time), cc.CallFunc.create(function () {
            talk_img.removeFromParent();
            self.talk_img_num -= 1;
            if (self.talk_img_num === 0) {
                if (!cc.audioEngine.isMusicPlaying()) {
                    cc.audioEngine.resumeMusic();
                }
            }
        })));
        // return talk_img;
    },

    show_op_tips: function () {
        cc.log("showOpTips");
        var show_tips_img = this.rootUINode.getChildByName("show_tips_img");
        show_tips_img.setVisible(true);
        var moveBy = cc.moveBy(0.5, cc.p(0, cc.winSize.height * 0.15));
        show_tips_img.runAction(cc.Sequence.create(cc.fadeIn(0.5), cc.DelayTime.create(0.5), cc.Spawn.create(moveBy, cc.fadeOut(0.5))));
        show_tips_img.setPosition(cc.winSize.width * 0.5, cc.winSize.height * 0.55);
    },
});