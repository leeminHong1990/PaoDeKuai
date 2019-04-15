// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var ArenaDailyRankUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/ArenaDailyRankUI.json";
        this.setLocalZOrder(const_val.MAX_LAYER_NUM);
    },
    initUI: function () {
        var self = this;
        this.rank_panel = this.rootUINode.getChildByName("rank_panel");
        var return_btn = this.rank_panel.getChildByName("return_btn");
        return_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });
    },
    show_by_info: function (flag, recordList) {
        var self = this;
        this.show(function () {
            if (recordList) {
                recordList = recordList.concat([]);
            }else {
                recordList = [];
            }
            var rank_tip_label=self.rank_panel.getChildByName("rank_tip_label");
            if (flag === 1){
                rank_tip_label.setString("正在进行中,请等待其他玩家结束比赛");
            }else {
                rank_tip_label.setString("比赛结束！");
            }

            var integral_scroll = self.rank_panel.getChildByName("integral_scroll");

            function update_item_func(curItem, curInfo, idx) {

                var id_label = curItem.getChildByName("id_label");
                id_label.setString((idx+1).toString());

                var name_label = curItem.getChildByName("name_label");
                name_label.setString(curInfo["nickname"]);

                var integral_label = curItem.getChildByName("integral_label");
                integral_label.setString(curInfo["score"]);
            }
            UICommonWidget.update_scroll_items(integral_scroll, recordList, update_item_func);

        });
    },
});
