// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var ArenaInfoUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/ArenaInfoUI.json";
    },
    initUI: function () {
        var self = this;
        this.rankinfo_panel = this.rootUINode.getChildByName("rankinfo_panel");
        this.daily_panel = this.rankinfo_panel.getChildByName("daily_panel");
        this.week_panel = this.rankinfo_panel.getChildByName("week_panel");
        var return_btn = this.rankinfo_panel.getChildByName("return_btn");
        return_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });
    },
    show_by_info: function (idx,recordList) {
        var self = this;
        this.show(function () {

            if (recordList["type"] === 1){
                self.daily_panel.setVisible(true);
                self.week_panel.setVisible(false);
                var btn_list = [self.daily_panel.getChildByName("title_btn_0"), self.daily_panel.getChildByName("title_btn_1"),self.daily_panel.getChildByName("title_btn_2")];
                var panel_list = [self.daily_panel.getChildByName("info_panel_0"), self.daily_panel.getChildByName("info_panel_1"),self.daily_panel.getChildByName("info_panel_2")];

                self.cur_tab = UICommonWidget.create_tab(btn_list, panel_list);
                var player = h1global.entityManager.player();
                var daily_rank = player.getDailySportRankList();
                if (daily_rank) {
                    daily_rank = daily_rank.concat([]).reverse();
                }

                // 排行榜
                panel_list[0].getChildByName("my_panel").getChildByName("ranking_label").setString("第"+daily_rank[idx]["ranking"]+"名");
                self.update_rank_info(daily_rank[idx]["detailed"]);
                // 赛事详细信息
                panel_list[1].getChildByName("name_label").setString("实时赛");
                panel_list[1].getChildByName("time_label").setString("10:00-22:00(周六除外)");
                panel_list[1].getChildByName("consume_label").setString("1张摩卡");

                // 赛事奖励
                panel_list[2].getChildByName("reward_label_0").setString("3张摩卡");
                panel_list[2].getChildByName("reward_label_1").setString("2张摩卡");
                panel_list[2].getChildByName("reward_label_2").setString("1张摩卡");

                panel_list[1].getChildByName("num_game_label").setString(recordList["op"]["game_round"] + "局");
                panel_list[1].getChildByName("people_num_label").setString(recordList["op"]["player_num"] + "人");

            }else if (recordList["type"] === 2){
                self.daily_panel.setVisible(false);
                self.week_panel.setVisible(true);
                var btn_list = [self.week_panel.getChildByName("title_btn_0"), self.week_panel.getChildByName("title_btn_1")];
                var panel_list = [self.week_panel.getChildByName("info_panel_0"), self.week_panel.getChildByName("info_panel_1")];

                self.cur_tab = UICommonWidget.create_tab(btn_list, panel_list);

                panel_list[0].getChildByName("name_label").setString("周赛");
                panel_list[0].getChildByName("time_label").setString("01:00-23:00(周六)");
                panel_list[0].getChildByName("consume_label").setString("1张摩卡");

                // 赛事奖励
                panel_list[1].getChildByName("reward_label_0").setString("108张摩卡");
                panel_list[1].getChildByName("reward_label_1").setString("78张摩卡");
                panel_list[1].getChildByName("reward_label_2").setString("58张摩卡");
                panel_list[1].getChildByName("reward_label_3").setString("10张摩卡");

                panel_list[0].getChildByName("num_game_label").setString(recordList["op"]["game_round"] + "局");
                panel_list[0].getChildByName("people_num_label").setString(recordList["op"]["player_num"] + "人");
            }
        });
    },

    update_rank_info:function (recordList) {
        var self = this;
        if (recordList) {
            recordList = recordList.concat([]);
        } else {
            recordList = [];
        }

        recordList.sort(self.sortKeyScore);

        var rank_scroll = self.daily_panel.getChildByName("info_panel_0").getChildByName("rank_scroll");

        function update_item_func(curItem, curInfo, idx) {
            curItem.getChildByName("rank_label").setString("第"+(idx+1)+"名");

            curItem.getChildByName("name_label").setString(curInfo["nickname"]);

            curItem.getChildByName("score_label").setString(curInfo["score"]);
        }

        UICommonWidget.update_scroll_items(rank_scroll, recordList, update_item_func);
    },

    update_time_info:function (type,time) {
        if (!time || Object.keys.length !== 1){
            return;
        }
        var string = "";
        for (var x in time){
            if (type === 1){
                string = x.toString()+"（周六除外）";
            }else if (type === 2){
                string = x.toString()+"（周六）";
            }
        }
        return string;
    },

    sortKeyScore:function (a,b) {
        if (a["score"] >= b["score"]){
            return false;
        }else {
            return true;
        }
    }

});
