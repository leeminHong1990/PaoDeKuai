var UnionRankUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/UnionRankUI.json";
    },

    initUI: function () {
        var self = this;
        this.union_rank_panel = this.rootUINode.getChildByName("union_rank_panel");
        var return_btn = this.union_rank_panel.getChildByName("return_btn");

        return_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });

        var access_btn = this.union_rank_panel.getChildByName("access_btn");

        access_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                cc.log("access_btn :", self.access);
                if (self.access === 0) {
                    self.access = 1;
                    cc.log("access_btn :", self.access);
                    access_btn.loadTexture("res/ui/UnionRankUI/acc_open_img.png");
                    h1global.entityManager.player().updateGroupNormalAcc(self.rankInfoList[0][0]["group_id"], self.access);
                } else {
                    self.access = 0;
                    access_btn.loadTexture("res/ui/UnionRankUI/acc_close_img.png");
                    h1global.entityManager.player().updateGroupNormalAcc(self.rankInfoList[0][0]["group_id"], self.access);
                }
            }
        });
    },

    show_info: function (rankInfo, acc, permission) {
        cc.log("rankInfo: ", rankInfo, acc, permission);
        var self = this;
        this.timeList = [];
        this.rankInfoList = [];
        this.rankInfo = [];
        this.winList = [];
        this.panelNum = 0;
        for (var i = 0; i < rankInfo.length; i++) {
            if (rankInfo[i].length !== 0) {
                this.timeList.push(cutil.convert_time_to_ymd(rankInfo[i][0]["create_time"]));
                this.rankInfoList.push(rankInfo[i]);
            }
        }
        this.access = 0;
        this.show(function () {
            var integral_btn0 = self.union_rank_panel.getChildByName("integral_btn0");
            var integral_btn1 = self.union_rank_panel.getChildByName("integral_btn1");
            var integral_btn2 = self.union_rank_panel.getChildByName("integral_btn2");
            self.integral_btn_list = [integral_btn0, integral_btn1, integral_btn2];
            //游戏模式
            function integral_btn_list_event(sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    for (var i = 0; i < self.integral_btn_list.length; i++) {
                        if (sender !== self.integral_btn_list[i]) {
                            self.integral_btn_list[i].setBright(true);
                            self.integral_btn_list[i].setTouchEnabled(true);
                        } else {
                            sender.setBright(false);
                            sender.setTouchEnabled(false);
                            self.panelNum = i;
                            self.initRankPanel(self.panelNum, self.rankInfo);
                        }
                    }
                }
            }

            for (var i = 0; i < self.integral_btn_list.length; i++) {
                var game_mode_btn = self.integral_btn_list[i];
                game_mode_btn.addTouchEventListener(integral_btn_list_event);
            }
            self.integral_btn_list[0].setBright(false);
            self.integral_btn_list[0].setTouchEnabled(false);

            cc.log("time_list :", self.timeList);
            cc.log("rankInfoList :", self.rankInfoList);
            if (self.rankInfoList.length !== 0) {
                self.rankInfo = self.rankInfoList[self.rankInfoList.length - 1];
                self.initRankPanel(self.panelNum, self.rankInfo);
            } else {
                self.initRankPanel(0, []);
            }

            // 切换时间模块
            var time_panel = self.union_rank_panel.getChildByName("time_panel");
            if (self.rankInfoList.length === 0) {
                time_panel.setVisible(false);
            }
            var time_label = time_panel.getChildByName("time_label");
            if (self.timeList.length === 0) {
                time_label.setString("");
            } else {
                time_label.setString(self.timeList[self.timeList.length - 1]);
            }
            var time_down_btn = time_panel.getChildByName("time_down_btn");
            time_down_btn.addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    var time_list_scroll = self.union_rank_panel.getChildByName("timelist_scroll");
                    if (time_list_scroll.isVisible()) {
                        time_list_scroll.setVisible(false);
                    } else {
                        time_list_scroll.setVisible(true);
                        var time_list = self.timeList;

                        function update_func(curItem, curInfo) {
                            var date_label = curItem.getChildByName("time_label");
                            date_label.setString(curInfo);
                        }

                        UICommonWidget.update_scroll_items(time_list_scroll, time_list, update_func);
                        var items = time_list_scroll.getChildren();
                        for (var i = 0; i < items.length; i++) {
                            let ii = i;
                            var time_label = items[i].getChildByName("time_label");
                            time_label.setTouchEnabled(true);
                            time_label.addTouchEventListener(function (sender, eventType) {
                                if (eventType === ccui.Widget.TOUCH_ENDED) {
                                    var label = time_panel.getChildByName("time_label");
                                    label.setString(sender.getString());
                                    time_list_scroll.setVisible(false);
                                    self.rankInfo = self.rankInfoList[ii];
                                    self.initRankPanel(self.panelNum, self.rankInfo);
                                }
                            });
                        }
                    }
                }
            });

            //对成员可见模块
            var access_btn = self.union_rank_panel.getChildByName("access_btn");
            var acc_label = self.union_rank_panel.getChildByName("acc_label");
            self.access = acc;
            if (self.access === 0) {
                access_btn.loadTexture("res/ui/UnionRankUI/acc_close_img.png");
            } else {
                access_btn.loadTexture("res/ui/UnionRankUI/acc_open_img.png");
            }
            if (permission === 0 && self.rankInfoList.length !== 0) {
                access_btn.setVisible(true);
                acc_label.setVisible(true);
            } else {
                access_btn.setVisible(false);
                acc_label.setVisible(false);
            }
        });
    },

    initRankPanel: function (panelNum, rankInfos) {
        var rank_title_panel = this.union_rank_panel.getChildByName("rank_title_panel");
        var integral_img = rank_title_panel.getChildByName("integral_img");
        var times_img = rank_title_panel.getChildByName("times_img");
        var win_img = rank_title_panel.getChildByName("win_img");

        function update_func(curItem, curInfo, idx) {
            let rank_img = curItem.getChildByName("rank_img");
            let rank_label = curItem.getChildByName("rank_label");
            if (idx <= 2) {
                rank_img.setVisible(true);
                rank_label.setVisible(false);
                rank_img.loadTexture("res/ui/LeaderboardUI/" + (idx + 1).toString() + ".png");
            } else {
                rank_img.setVisible(false);
                rank_label.setVisible(true);
                rank_label.setString((idx + 1).toString());
            }
            curItem.getChildByName("name_label").setString(curInfo["nickname"]);
            curItem.getChildByName("userid_label").setString(curInfo["userId"].toString());
            curItem.getChildByName("remark_label").setString(curInfo["remark"]);
            if (panelNum === 0) {
                curItem.getChildByName("integral_label").setString(curInfo["integral"]);
            } else if (panelNum === 1) {
                curItem.getChildByName("integral_label").setString(curInfo["join_times"]);
            } else {
                curItem.getChildByName("integral_label").setString(curInfo["winner_times"]);
            }
        }

        cc.log("UnionRankUI info 000 =", rankInfos);
        var rankList = [];
        if (panelNum === 0) {
            integral_img.setVisible(true);
            times_img.setVisible(false);
            win_img.setVisible(false);
            rankInfos.sort(function (rank1, rank2) {
                return rank2["integral"] - rank1["integral"];
            });
            rankList = rankInfos.concat([]);
        } else if (panelNum === 1) {
            integral_img.setVisible(false);
            win_img.setVisible(false);
            times_img.setVisible(true);
            rankInfos.sort(function (rank1, rank2) {
                return rank2["join_times"] - rank1["join_times"];
            });
            rankList = rankInfos.concat([]);
        } else {
            integral_img.setVisible(false);
            times_img.setVisible(false);
            win_img.setVisible(true);
            for (var i = 0; i < rankInfos.length; i++) {
                if (rankInfos[i]["winner_times"] > 0) {
                    rankList.push(rankInfos[i])
                }
            }
            rankList.sort(function (rank1, rank2) {
                return rank2["winner_times"] - rank1["winner_times"];
            });
        }
        cc.log("UnionRankUI info 111 =", rankList);
        var rank_scroll = this.union_rank_panel.getChildByName("rank_scroll");
        UICommonWidget.update_scroll_items(rank_scroll, rankList, update_func);
    },
});