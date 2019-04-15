// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var ArenaWeeklyDetailsUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/ArenaWeeklyDetailsUI.json";
        this.setLocalZOrder(const_val.MAX_LAYER_NUM + 2);
    },

    initUI: function () {

        this.details_panel = this.rootUINode.getChildByName("details_panel");
        var self = this;

        this.details_panel.getChildByName("return_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType == ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });
    },

    show_by_info: function (scoreInfo) {
        var self = this;
        this.show(function () {
            var total_score = 0;
            for (var i = 0; i < scoreInfo["score"].length; i++) {
                var score_label = self.details_panel.getChildByName("score_label_" + (i + 1).toString());
                score_label.setVisible(true);
                score_label.setString(scoreInfo["score"][i]);
                total_score = total_score + scoreInfo["score"][i];

                var label_img = self.details_panel.getChildByName("label_img_" + (i + 1).toString());
                label_img.setVisible(true);
            }
            var score_label = self.details_panel.getChildByName("score_label_0");
            score_label.setVisible(true);
            score_label.setString(total_score);

            var label_img = self.details_panel.getChildByName("label_img_0");
            label_img.setVisible(true);
        });
    },

});