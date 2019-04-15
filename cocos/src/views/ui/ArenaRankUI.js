// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var ArenaRankUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/ArenaRankUI.json";
    },
    initUI: function () {
        this.drop_title_list = [1, 2];
        var self = this;
        this.rank_panel = this.rootUINode.getChildByName("rank_panel");
        this.drop_title_panel = this.rank_panel.getChildByName("drop_title_panel");
        this.daily_panel = this.rank_panel.getChildByName("daily_panel");
        this.week_panel = this.rank_panel.getChildByName("week_panel");
        var return_btn = this.rank_panel.getChildByName("return_btn");
        return_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });

        var player = h1global.entityManager.player();
        this.daily_rank = player.getDailySportRankList();
        this.update_daily_rank_info(this.daily_rank);

        this.init_title_panel();
    },

    init_title_panel: function () {
        var self = this;
        this.drop_state_list = {
            open: 1,
            close: [2]
        }

        var drop_scroll = this.drop_title_panel.getChildByName("drop_scroll");
        var drop_open_btn = this.drop_title_panel.getChildByName("drop_open_btn");
        drop_open_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                drop_scroll.setVisible(false);
                drop_close_btn.setVisible(true);
                drop_open_btn.setVisible(false);
            }
        });
        var drop_close_btn = this.drop_title_panel.getChildByName("drop_close_btn");
        drop_close_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                drop_close_btn.setVisible(false);
                drop_open_btn.setVisible(true);
                drop_scroll.setVisible(true);
                self.update_drop_panel();
            }
        });

    },

    update_drop_panel: function () {
        var self = this;

        var drop_scroll = self.drop_title_panel.getChildByName("drop_scroll");
        var title_main_img = self.drop_title_panel.getChildByName("title_img");
        var drop_open_btn = this.drop_title_panel.getChildByName("drop_open_btn");
        var drop_close_btn = this.drop_title_panel.getChildByName("drop_close_btn");

        function update_item_func(curItem, curInfo, idx) {
            var title_img = curItem.getChildByName("title_img");
            title_img.loadTexture("res/ui/ArenaRankUI/title_txt_" + (curInfo).toString() + ".png");
            title_img.ignoreContentAdaptWithSize(true);
            title_img.setTouchEnabled(true);
            title_img.addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    drop_scroll.setVisible(false);
                    title_main_img.loadTexture("res/ui/ArenaRankUI/title_txt_" + (curInfo).toString() + ".png");
                    title_main_img.ignoreContentAdaptWithSize(true);
                    self.drop_state_list.open = curInfo;
                    self.drop_state_list.close = [];
                    for (var x of self.drop_title_list) {
                        if (x !== curInfo) {
                            self.drop_state_list.close.push(x);
                        }
                    }
                    //
                    self.update_rank_panel(curInfo);
                    drop_close_btn.setVisible(true);
                    drop_open_btn.setVisible(false);
                }
            });
        }

        UICommonWidget.update_scroll_items(drop_scroll, this.drop_state_list.close, update_item_func);
    },

    update_rank_panel: function (flag) {
        var player = h1global.entityManager.player();
        if (flag === 1) {
            this.daily_rank = player.getDailySportRankList();
            this.update_daily_rank_info(this.daily_rank);
        } else if (flag === 2) {
            cutil.lock_ui();
            var sportInfos = cutil.getSportInfoList();
            player.getWeeklySportRank(sportInfos["2"]["id"]);
        }
    },

    update_daily_rank_info: function (recordList) {
        var self = this;
        if (recordList) {
            recordList = recordList.concat([]).reverse();
        } else {
            recordList = [];
        }

        this.daily_panel.setVisible(true);
        this.week_panel.setVisible(false);
        var rank_scroll = self.daily_panel.getChildByName("rank_scroll");

        function update_item_func(curItem, curInfo, idx) {
            curItem.getChildByName("name_label").setString("实时赛");

            curItem.getChildByName("room_label").setString(curInfo["rankingId"].toString());

            var date_label = curItem.getChildByName("date_label");
            date_label.setString(cutil.convert_date_to_ymd(curInfo["time"]));

            var time_label = curItem.getChildByName("time_label");
            time_label.setString(cutil.convert_date_to_hms(curInfo["time"]));

            var ranking_img = curItem.getChildByName("ranking_img");
            ranking_img.loadTexture("res/ui/ArenaRankUI/num/" + curInfo["ranking"] + ".png");
            ranking_img.ignoreContentAdaptWithSize(true);

            var reward_label = curItem.getChildByName("reward_label");
            if (curInfo["reward"] > 0) {
                reward_label.setString("摩卡 X " + curInfo["reward"]);
            } else {
                reward_label.setString("--");
            }

            curItem.setTouchEnabled(true);
            curItem.addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    var sportInfos = cutil.getSportInfoList();
                    h1global.curUIMgr.arenainfo_ui.show_by_info(idx, sportInfos["1"][0]);
                }
            });
        }

        UICommonWidget.update_scroll_items(rank_scroll, recordList, update_item_func);
    },

    update_week_rank_info: function (isOpen, recordList) {
        cutil.unlock_ui();
        var self = this;
        if (recordList) {
            recordList = recordList.concat([]);
        } else {
            recordList = [];
        }
        var info_dict = eval('(' + cc.sys.localStorage.getItem("INFO_JSON") + ')');
        var my_info_panel = self.week_panel.getChildByName("my_info_panel");
        this.daily_panel.setVisible(false);
        this.week_panel.setVisible(true);
        if (recordList.length == 0) {
            my_info_panel.setVisible(false);
        } else {
            my_info_panel.setVisible(true);
        }
        var idx = self.IsinRank(recordList);
        if (idx >= 0) {
            my_info_panel.getChildByName("rank_id_label").setString("第" + (idx + 1) + "名");
            my_info_panel.getChildByName("score_label").setString(recordList[idx]["score"]);
            var state_img = my_info_panel.getChildByName("state_img");
            var state_label = my_info_panel.getChildByName("state_label");
            if (isOpen === 1) {
                state_img.loadTexture("res/ui/ArenaRankUI/title_open.png");
                state_img.ignoreContentAdaptWithSize(true);

                state_label.setString("待审核");
                state_label.setTextColor(cc.color(211, 114, 98));
            } else {
                state_img.loadTexture("res/ui/ArenaRankUI/title_close.png");
                state_img.ignoreContentAdaptWithSize(true);

                state_label.setString("已审核");
                state_label.setTextColor(cc.color(134, 180, 68));
            }
            if (recordList[idx]["reward"] > 0) {
                my_info_panel.getChildByName("reward_label").setString("摩卡 X " + recordList[idx]["reward"]);
            } else {
                my_info_panel.getChildByName("reward_label").setString("--");
            }
        } else {
            my_info_panel.getChildByName("rank_id_label").setString("--");
            my_info_panel.getChildByName("score_label").setString("--");
            var state_img = my_info_panel.getChildByName("state_img");
            var state_label = my_info_panel.getChildByName("state_label");

            state_img.loadTexture("res/ui/ArenaRankUI/title_open.png");
            state_img.ignoreContentAdaptWithSize(true);

            state_label.setString("待审核");
            state_label.setTextColor(cc.color(211, 114, 98));
            my_info_panel.getChildByName("reward_label").setString("--");
        }


        var rank_scroll = self.week_panel.getChildByName("rank_scroll");

        function update_item_func(curItem, curInfo, idx) {
            curItem.getChildByName("name_label").setString(curInfo["nickname"]);

            curItem.getChildByName("rank_label").setString("第" + (idx + 1) + "名");

            curItem.getChildByName("score_label").setString(curInfo["score"]);

            var ranking_img = curItem.getChildByName("ranking_img");
            var state_label = curItem.getChildByName("state_label");
            if (isOpen === 1) {
                ranking_img.loadTexture("res/ui/ArenaRankUI/title_open.png");
                ranking_img.ignoreContentAdaptWithSize(true);

                state_label.setString("待审核");
                state_label.setTextColor(cc.color(211, 114, 98));
            } else {
                ranking_img.loadTexture("res/ui/ArenaRankUI/title_close.png");
                ranking_img.ignoreContentAdaptWithSize(true);

                state_label.setString("已审核");
                state_label.setTextColor(cc.color(134, 180, 68));
            }

            var reward_label = curItem.getChildByName("reward_label");
            if (curInfo["reward"] > 0) {
                reward_label.setString("摩卡 X " + curInfo["reward"]);
            } else {
                reward_label.setString("--");
            }

            curItem.setTouchEnabled(true);
            curItem.addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    var sportInfos = cutil.getSportInfoList();
                    h1global.curUIMgr.arenainfo_ui.show_by_info(0, sportInfos["2"]);
                }
            });
        }

        UICommonWidget.update_scroll_items(rank_scroll, recordList, update_item_func);
    },

    IsinRank: function (recordList) {
        var info_dict = eval('(' + cc.sys.localStorage.getItem("INFO_JSON") + ')');
        var flag = 0;
        for (var i = 0, len = recordList.length; i < len; i++) {
            if (recordList[i]["userId"] === parseInt(info_dict["user_id"])) {
                flag = 1;
                return i;
            }
        }
        if (flag === 0) {
            return -1;
        }
    }
});
