// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var ResultUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/ResultUI.json";
        this.player_num = 3;
        this.sportId = 0;
        this.sportType = 0;
        this.setLocalZOrder(const_val.MAX_LAYER_NUM);
    },
    initUI: function () {
        var self = this;
        this.update_player_num();
        var player = h1global.entityManager.player();
        var share_btn = this.rootUINode.getChildByName("result_panel").getChildByName("share_btn");
        if ((cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative) && switches.appstore_check === true) {
            share_btn.setVisible(false);
        }
        function share_btn_event(sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                if ((cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative)) {
                    jsb.fileUtils.captureScreen("", "screenShot.png");
                } else if ((cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative)) {
                    jsb.reflection.callStaticMethod("WechatOcBridge", "takeScreenShot");
                } else {
                    h1global.curUIMgr.share_ui.show();
                }
            }
        }

        share_btn.addTouchEventListener(share_btn_event);

        var take_sport_btn = this.rootUINode.getChildByName("result_panel").getChildByName("take_sport_btn");

        function take_sport_btn_event(sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                player.joinSport(self.sportId);
            }
        }

        take_sport_btn.addTouchEventListener(take_sport_btn_event);

        var quit_room_btn = this.rootUINode.getChildByName("result_panel").getChildByName("quit_room_btn");

        function quit_room_btn_event(sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                h1global.globalUIMgr.infobtn_ui.show_by_info("在规定的时间内若未完成比赛，将视为主动弃权，是否休息？", cc.size(530, 302), function () {
                    h1global.entityManager.player().curGameRoom = null;
                    if (onhookMgr) {
                        onhookMgr.setApplyCloseLeftTime(null);
                    }
                    h1global.runScene(new ArenaScene());
                });
            }
        }

        quit_room_btn.addTouchEventListener(quit_room_btn_event);

    },
    update_player_num: function () {
        this.player_panels = [];
        for (var i = 0; i < this.player_num; i++) {
            this.player_panels.push(this.rootUINode.getChildByName("result_panel").getChildByName("player_info_panel" + i.toString()));
        }
        // 更改位置
        if (this.player_num === 2) {
            this.rootUINode.getChildByName("result_panel").getChildByName("player_info_panel2").setVisible(false);
            this.rootUINode.getChildByName("result_panel").getChildByName("player_info_panel3").setVisible(false);

            this.rootUINode.getChildByName("result_panel").getChildByName("player_info_panel0").setPositionX(cc.winSize.width / 10 * 3);
            this.rootUINode.getChildByName("result_panel").getChildByName("player_info_panel1").setPositionX(cc.winSize.width / 10 * 7);
        } else if (this.player_num === 3) {
            this.rootUINode.getChildByName("result_panel").getChildByName("player_info_panel3").setVisible(false);

            this.rootUINode.getChildByName("result_panel").getChildByName("player_info_panel1").setPositionX(cc.winSize.width / 2);
            this.rootUINode.getChildByName("result_panel").getChildByName("player_info_panel0").setPositionX(cc.winSize.width / 2 - 308 - 40);
            this.rootUINode.getChildByName("result_panel").getChildByName("player_info_panel2").setPositionX(cc.winSize.width / 2 + 308 + 40);
        }
    },

    show_by_info: function (finalPlayerInfoList, roundRoomInfo, weeklyScoreList) {
        var self = this;
        this.player_num = finalPlayerInfoList.length;
        this.show(function () {
            self.sportId = roundRoomInfo["sport_id"];
            self.sportType = roundRoomInfo["sport_type"];
            for (var i = 0; i < finalPlayerInfoList.length; i++) {
                var finalPlayerInfo = finalPlayerInfoList[i];
                self.update_player_info(finalPlayerInfo["idx"], finalPlayerInfo, weeklyScoreList[i]);
            }
            cc.log("sportId , sportType:", self.sportId, self.sportType);
            self.show_win();
            self.update_result_room_info(roundRoomInfo);
            self.update_sport(self.sportType);
            cutil.unlock_ui();

            var confirm_btn = self.rootUINode.getChildByName("result_panel").getChildByName("confirm_btn");

            function confirm_btn_event(sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    h1global.entityManager.player().curGameRoom = null;
                    if (onhookMgr) {
                        onhookMgr.setApplyCloseLeftTime(null);
                    }
                    if (self.sportId > 0) {
                        h1global.runScene(new ArenaScene());
                    } else {
                        h1global.runScene(new GameHallScene());
                    }
                }
            }

            confirm_btn.addTouchEventListener(confirm_btn_event);

            if (!((cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative) || (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) || switches.TEST_OPTION)) {
                var curGameRoom = h1global.entityManager.player().curGameRoom;
                var result_list = {};
                var result_str = '';
                for (var i = 0; i < finalPlayerInfoList.length; i++) {
                    var finalPlayerInfo = finalPlayerInfoList[i];
                    result_list[finalPlayerInfo["idx"]] = finalPlayerInfo;
                }
                for (var i = 0; i < finalPlayerInfoList.length; i++) {
                    if (result_list[i]) {
                        result_str = result_str + '[' + curGameRoom.playerInfoList[i]["nickname"] + ']:' + result_list[i]["score"];
                        if (i !== finalPlayerInfoList.length - 1) {
                            result_str = result_str + ','
                        }
                    }
                }
                wx.onMenuShareAppMessage({
                    title: '房间号【' + curGameRoom.roomID.toString() + '】', // 分享标题
                    desc: result_str, // 分享描述
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
                wx.onMenuShareTimeline({
                    title: '房间号【' + self.roomID.toString() + '】', // 分享标题
                    desc: result_str, // 分享描述
                    link: switches.h5entrylink, // 分享链接
                    imgUrl: '', // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        cc.log("onMenuShareTimeline Success!");
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        cc.log("onMenuShareTimeline Cancel!");
                    },
                    fail: function () {
                        cc.log("onMenuShareTimeline Fail")
                    },
                });
            }
        });
    },

    show_win: function () {
        var self = this;
        var maxscore = 0;
        var scorelist = [];
        var flag = 0;
        for (var i = 0; i < self.player_num; i++) {
            var score = parseInt(self.player_panels[i].getChildByName("score_label").getString());
            scorelist.push(score);
            if (score > maxscore) {
                maxscore = score;
                flag = i;
            }
        }

        if (maxscore !== 0) {
            // 存在最大值多个
            var result = [];
            for (var item in scorelist) {
                if (scorelist[item] === maxscore) {
                    result.push(item);
                }
            }
            if (result.length === 1) {
                self.player_panels[flag].getChildByName("win_img").setVisible(true);
            } else {
                for (var i in result) {
                    self.player_panels[result[i]].getChildByName("win_img").setVisible(true);
                }
            }
        }
    },

    update_sport: function (sportType) {
        var player = h1global.entityManager.player();
        var share_btn = this.rootUINode.getChildByName("result_panel").getChildByName("share_btn");
        var confirm_btn = this.rootUINode.getChildByName("result_panel").getChildByName("confirm_btn");
        var take_sport_btn = this.rootUINode.getChildByName("result_panel").getChildByName("take_sport_btn");
        var quit_room_btn = this.rootUINode.getChildByName("result_panel").getChildByName("quit_room_btn");
        var sportSurplusTimes = player.getSurplusTimes();
        cc.log("sportSurplusTimes :", sportSurplusTimes);
        cc.log("sportType:", sportType);
        if (sportSurplusTimes > 0 && sportType === 2) {
            quit_room_btn.setVisible(true);
            take_sport_btn.setVisible(true);
            confirm_btn.setVisible(false);
            share_btn.setVisible(false);
        } else {
            quit_room_btn.setVisible(false);
            take_sport_btn.setVisible(false);
            confirm_btn.setVisible(true);
            share_btn.setVisible(true);
        }
    },

    update_result_room_info: function (roomInfo) {
        var room_info = "房间号:" + roomInfo["room_id"];
        var groupName = roomInfo["group_name"];
        if (groupName.length === 0) {
            room_info += ""
        } else {
            room_info += " 公会:" + groupName;
        }
        room_info += " " + roomInfo["end_time"];
        var game_mode = roomInfo["room_info"]["game_mode"];
        var player_num = roomInfo["room_info"]["player_num"];
        var game_start = roomInfo["room_info"]["game_start"];
        var game_deal = roomInfo["room_info"]["game_deal"];
        var game_force = roomInfo["room_info"]["game_force"];
        if (game_mode === 0) {
            room_info += " 经典模式";
        } else if (game_mode === 1) {
            room_info += " 15张模式";
        } else {
            room_info += " 癞子模式";
        }

        if (player_num === 2) {
            room_info += " 两人局";
        } else if (player_num === 3) {
            room_info += " 三人局";
        } else {
            room_info += " 四人局";
        }

        if (player_num === 2) {
            room_info += " 首局无要求";
        } else {
            if (game_start === 1) {
                room_info += " 首局无要求";
            } else {
                room_info += " 首局先出黑桃3";
            }
        }

        if (game_force === 1) {
            room_info += " 可不要";
        } else {
            room_info += " 必须管";
        }

        var room_info_label = this.rootUINode.getChildByName("result_panel").getChildByName("room_info_label");
        room_info_label.setString(room_info);
    },

    update_player_info: function (serverSeatNum, finalPlayerInfo, weeklyScoreList) {
        cc.log("finalPlayerInfo: ", finalPlayerInfo);
        var player = h1global.entityManager.player();
        var playerInfo = player.curGameRoom.playerInfoList[serverSeatNum];
        var cur_player_info_panel = this.player_panels[serverSeatNum];
        cur_player_info_panel.getChildByName("name_label").setString(playerInfo["nickname"]);
        cur_player_info_panel.getChildByName("id_label").setString("ID:" + playerInfo["userId"].toDouble().toString());
        var frame_img = ccui.helper.seekWidgetByName(cur_player_info_panel, "frame_img");
        cur_player_info_panel.reorderChild(frame_img, 1);

        cutil.loadPortraitTexture(playerInfo["head_icon"], function (img) {
            cur_player_info_panel.getChildByName("portrait_sprite").removeFromParent();
            var portrait_sprite = new cc.Sprite(img);
            portrait_sprite.setName("portrait_sprite");
            portrait_sprite.setScale(80 / portrait_sprite.getContentSize().width);
            portrait_sprite.x = cur_player_info_panel.getContentSize().width * 0.28;
            portrait_sprite.y = cur_player_info_panel.getContentSize().height * 0.83;
            cur_player_info_panel.addChild(portrait_sprite);
        }, playerInfo["uuid"].toString() + ".png");
        this.player_panels[serverSeatNum].getChildByName("score_label").setString(finalPlayerInfo["score"].toString());
        this.player_panels[serverSeatNum].getChildByName("best_score_label").setString(finalPlayerInfo["best_score"].toString());
        this.player_panels[serverSeatNum].getChildByName("bomb_frequency_label").setString(finalPlayerInfo["bomb_times"].toString());
        this.player_panels[serverSeatNum].getChildByName("win_frequency_label").setString(finalPlayerInfo["win_times"].toString());
        this.player_panels[serverSeatNum].getChildByName("sum_label").setString("/" + (finalPlayerInfo["lose_times"]).toString());

        var self = this;
        var details_btn = this.player_panels[serverSeatNum].getChildByName("details_btn");
        if (self.sportType === 2) {
            details_btn.setVisible(true);
            details_btn.addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    h1global.curUIMgr.arenaweeklydetails_ui.show_by_info(weeklyScoreList);
                }
            });
        } else {
            details_btn.setVisible(false);
        }
    },
});
