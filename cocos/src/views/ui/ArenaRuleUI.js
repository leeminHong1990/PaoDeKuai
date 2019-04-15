// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var ArenaRuleUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/ArenaRuleUI.json";
    },
    initUI: function () {
        var self = this;
        this.rankinfo_panel = this.rootUINode.getChildByName("rankinfo_panel");
        var return_btn = this.rankinfo_panel.getChildByName("return_btn");
        return_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });
    },
    show_by_info: function (recordList) {
        var self = this;
        this.show(function () {

            var btn_list = [self.rankinfo_panel.getChildByName("title_btn_0"), self.rankinfo_panel.getChildByName("title_btn_1")];
            var panel_list = [self.rankinfo_panel.getChildByName("info_panel_0"), self.rankinfo_panel.getChildByName("info_panel_1")];

            self.cur_tab = UICommonWidget.create_tab(btn_list, panel_list);

            // 赛事详细信息
            if (recordList["type"] === 1) {
                panel_list[0].getChildByName("name_label").setString("实时赛");
                panel_list[0].getChildByName("time_label").setString("10:00-22:00(周六除外)");
                panel_list[0].getChildByName("consume_label").setString("1张摩卡(每天3次免费)");

                // 赛事奖励
                panel_list[1].getChildByName("reward_label_0").setString("3张摩卡");
                panel_list[1].getChildByName("reward_label_1").setString("2张摩卡");
                panel_list[1].getChildByName("reward_label_2").setString("1张摩卡");
                panel_list[1].getChildByName("title_label_3").setVisible(false);
                panel_list[1].getChildByName("reward_label_3").setVisible(false);
            } else if (recordList["type"] === 2) {
                panel_list[0].getChildByName("name_label").setString("周赛");
                panel_list[0].getChildByName("time_label").setString("01:00-23:00(周六)");
                panel_list[0].getChildByName("consume_label").setString("1张摩卡");

                // 赛事奖励
                panel_list[1].getChildByName("reward_label_0").setString("108张摩卡");
                panel_list[1].getChildByName("reward_label_1").setString("78张摩卡");
                panel_list[1].getChildByName("reward_label_2").setString("58张摩卡");
                panel_list[1].getChildByName("title_label_3").setVisible(true);
                panel_list[1].getChildByName("reward_label_3").setVisible(true);
                panel_list[1].getChildByName("reward_label_3").setString("10张摩卡");
            }

            panel_list[0].getChildByName("num_game_label").setString(recordList["op"]["game_round"] + "局");
            panel_list[0].getChildByName("people_num_label").setString(recordList["op"]["player_num"] + "人");

        });
    },

    update_time_info: function (type, time) {
        if (!time || Object.keys.length !== 1) {
            return;
        }
        var string = "";
        for (var x in time) {
            if (type === 1) {
                string = x.toString() + "（周六除外）";
            } else if (type === 2) {
                string = x.toString() + "（周六）";
            }
        }
        return string;
    }
});
