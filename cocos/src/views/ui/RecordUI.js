"use strict";
// let UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var RecordUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/RecordUI.json";
    },

    initUI: function () {
        this.curState = 0;
        this.record_panel = this.rootUINode.getChildByName("record_panel");
        var player = h1global.entityManager.player();
        var self = this;
        this.return_btn = this.record_panel.getChildByName("return_btn");
        this.return_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });

        this.back_btn = this.record_panel.getChildByName("back_btn");
        this.back_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.back_btn.setVisible(false);
                self.return_btn.setVisible(true);
                self.other_show_btn.setVisible(true);
                self.record_scroll.setVisible(true);
                self.record_item_panel.setVisible(false);
                self.updateRecordScroll(0, player.gameRecordList);
            }
        });

        // 他人回看码
        this.other_show_btn = this.record_panel.getChildByName("other_show_btn");
        this.other_show_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                h1global.curUIMgr.inputlayer_ui.show_name(const_val.GAME_BACK_PLAY);
            }
        });

        this.record_scroll = this.record_panel.getChildByName("record_scroll");
        this.record_item_panel = this.record_panel.getChildByName("record_item_panel");
        this.record_item_scroll = this.record_item_panel.getChildByName("record_item_scroll");
        cc.log("gameRecordList ", player.gameRecordList);
        this.updateRecordScroll(0, player.gameRecordList);
    },

    updateRecordScroll: function (curState, recordList) {
        // recordList反向
        recordList = recordList.concat([]).reverse();
        var self = this;
        self.curState = curState;
        function update_func(curItem, curInfo) {
            let date_label = curItem.getChildByName("date_label");
            let time_label = curItem.getChildByName("time_label");

            // 游戏总体信息，时间取第1局开始的时间
            date_label.setString(curInfo["round_result"][0]["date"]);
            time_label.setString(curInfo["round_result"][0]["time"]);
            time_label.setVisible(true);

            let room_num_label = curItem.getChildByName("room_num_label");
            room_num_label.setString(curInfo["roomID"] + "号房间");

            var max_score_player = 0;
            var max_score = Number.EPSILON;
            for (let i = 0; i < curInfo["user_info_list"].length; i++) {
                let player_label = curItem.getChildByName("player_label" + i.toString());
                let score_label = curItem.getChildByName("score_label" + i.toString());
                if (!curInfo["user_info_list"][i]) {
                    player_label.setVisible(false);
                    score_label.setVisible(false);
                    return
                }
                player_label.setVisible(true);
                score_label.setVisible(true);
                player_label.setString(curInfo["user_info_list"][i]["nickname"]);
                var total_score = 0;
                for (let j = 0; j < curInfo["round_result"].length; j++) {
                    total_score += curInfo["round_result"][j]["round_record"][i]["score"];
                    score_label.setString(total_score.toString());
                }
                if (total_score > max_score) {
                    max_score = total_score;
                    max_score_player = i;
                }
            }
            // 判断胜负

            var info_dict = eval('(' + cc.sys.localStorage.getItem("INFO_JSON") + ')');
            var win_or_lose_img = curItem.getChildByName("win_or_lose_img");
            if (parseInt(info_dict["user_id"]) === curInfo["user_info_list"][max_score_player]["userID"]) {
                win_or_lose_img.loadTexture("res/ui/RecordUI/win_img.png");
            } else {
                win_or_lose_img.loadTexture("res/ui/RecordUI/lose_img.png");
            }
        }

        function update_item_func(curItem, curInfo, idx) {
            let date_label = curItem.getChildByName("date_label");
            let time_label = curItem.getChildByName("time_label");
            let id_label = curItem.getChildByName("id_label");
            // 游戏总体信息，时间取第1局开始的时间
            date_label.setString(curInfo["date"].substring(5, 10));
            time_label.setString(curInfo["time"]);
            time_label.setVisible(true);
            id_label.setString((idx + 1).toString());
            if ((idx + 1) % 2 === 0) {
                curItem.getChildByName("bg_img").setVisible(false);
            }
            self.resetPlayerNum(curItem);
            for (let i = 0; i < curInfo["round_record"].length; i++) {
                let player_label = self.record_item_panel.getChildByName("player_label" + i.toString());
                let score_label = curItem.getChildByName("score_label" + i.toString());

                if (!curInfo["round_record"][i]) {
                    player_label.setVisible(false);
                    score_label.setVisible(false);
                    return
                }
                player_label.setVisible(true);
                score_label.setVisible(true);
                player_label.setString(curInfo["round_record"][i]["nickname"]);
                score_label.setString(curInfo["round_record"][i]["score"].toString());
            }
            // 分享与回放
            let share_btn = curItem.getChildByName("share_btn");
            if ((cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative) && switches.appstore_check === true) {
                share_btn.setVisible(false);
            }
            var share_title = "跑得快";
            var share_desc = "我在跑得快里面玩了一局回看码是[" + curInfo["recordId"] + "],邀请你一起观看。";
            share_btn.addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    if ((cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative)) {
                        jsb.reflection.callStaticMethod(switches.package_name + "/AppActivity", "callWechatShareUrl", "(ZLjava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", true, switches.share_android_url, share_title, share_desc);
                    } else if ((cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative)) {
                        jsb.reflection.callStaticMethod("WechatOcBridge", "callWechatShareUrlToSession:fromUrl:withTitle:andDescription:", true, switches.share_ios_url, share_title, share_desc);
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
                        h1global.globalUIMgr.info_ui.show_by_info("请点击微信右上角菜单进行分享");
                    }
                }
            });
            let show_btn = curItem.getChildByName("show_btn");
            show_btn.addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    self.checkPlayBackCode(curInfo["recordId"]);
                }
            });

        }

        UICommonWidget.update_scroll_items(this.record_scroll, recordList, update_func);
        var items = this.record_scroll.getChildren();
        for (var ii = 0; ii < items.length; ii++) {
            let i = ii;
            items[i].addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    if (self.curState === 0) {
                        self.curState = 1;
                        self.back_btn.setVisible(true);
                        self.return_btn.setVisible(false);
                        self.record_scroll.setVisible(false);
                        self.record_item_panel.setVisible(true);
                        UICommonWidget.update_scroll_items(self.record_item_scroll, recordList[i]["round_result"], update_item_func);
                    }
                }
            });
        }
    },

    resetPlayerNum: function (curItem) {
        for (let i = 0; i < 4; i++) {
            let player_label = this.record_item_panel.getChildByName("player_label" + i.toString());
            let score_label = curItem.getChildByName("score_label" + i.toString());
            player_label.setVisible(false);
            score_label.setVisible(false);
        }
    },

    checkPlayBackCode: function (text) {
        if (cutil.isPositiveNumber(text)) {
            let player = h1global.entityManager.player();
            if (!player) {
                cc.log('player undefined');
                return false;
            }
            player.reqPlayback(cc.isNumber(text) ? text : parseInt(text));
            return true;
        } else {
            h1global.globalUIMgr.info_ui.show_by_info("回放码错误！")
        }
        return false;
    }
});