// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var ArenaResultUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/ArenaResultUI.json";
    },
    initUI: function () {
        this.arenaresult_panel = this.rootUINode.getChildByName("arenaresult_panel");
        var return_btn = this.arenaresult_panel.getChildByName("return_btn");
        return_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });
    },
    show_by_info: function (recordList) {
        var self = this;
        this.show(function () {
            if (recordList) {
                recordList = recordList.concat([]);
            }

            var arena_info_scroll = this.arenaresult_panel.getChildByName("arena_info_scroll");

            function update_item_func(curItem, curInfo, idx) {

                var id_label = curItem.getChildByName("id_label");
                id_label.setString(curInfo["0"]);

                var score_label = curItem.getChildByName("score_label");
                score_label.setString(curInfo["1"]);

                var max_score_label = curItem.getChildByName("max_score_label");
                max_score_label.setString(curInfo["2"]);

                var ranking_current_label  = curItem.getChildByName("ranking_current_label ");
                ranking_current_label .setString(curInfo["3"]);

                var ranking_total_label = curItem.getChildByName("ranking_total_label");
                ranking_total_label.setString(curInfo["4"]);

                var best_name_label = curItem.getChildByName("best_name_label");
                best_name_label.setString(curInfo["5"]);

                var best_score_label = curItem.getChildByName("best_score_label");
                best_score_label.setString(curInfo["6"]);

            }
            UICommonWidget.update_scroll_items(arena_info_scroll, recordList, update_item_func);

        });
    },
});
