// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var SignUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/SignUI.json";

    },
    initUI: function () {
        this._Day = 0;                                                 //可以签到的那一天 1,2,3,4

        this.sign_panel = this.rootUINode.getChildByName("sign_panel");
        var self = this;
        this.sign_panel.getChildByName("return_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });
    },

    //读取签到记录，更改下一天签到状态
    preSign: function (signDay) {
        var self = this;
        for (var i = 0; i < 7; i++) {
            let day_panel = ccui.helper.seekWidgetByName(self.sign_panel, "day_panel_" + (i + 1).toString());
            let cover_panel = day_panel.getChildByName("cover_panel");
            let light_img = day_panel.getChildByName("light_img");
            if (i < signDay){
                cover_panel.setVisible(true);
                day_panel.setTouchEnabled(false);
                light_img.setVisible(false);
            }else if (i === signDay){
                cover_panel.setVisible(false);
                day_panel.setTouchEnabled(true);
                light_img.setVisible(true);
            }else {
                cover_panel.setVisible(false);
                day_panel.setTouchEnabled(false);
                light_img.setVisible(false);
            }
        }
    },

    //签到
    touchSign: function () {
        var player = h1global.entityManager.player();
        player.signIn();
    },

    reqSignInfo:function () {
        var player = h1global.entityManager.player();
        player.reqSignInfo();
    },

    preSignInfo:function (info,signDay) {
        var self = this;
        this.info = info;
        this.sign_day = signDay;
        this.show(function () {
            function touch_event(sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    self.touchSign();
                }
            }
            for (var i = 0; i < 7; i++) {
                var day_panel = self.sign_panel.getChildByName("day_panel_" + (i + 1).toString());
                if (!day_panel) {
                    return
                }
                day_panel.addTouchEventListener(touch_event);
                var reward_fnt =day_panel.getChildByName("reward_fnt");
                reward_fnt.setString(self.info["day"+(i+1).toString()]);
            }
            self.preSign(self.sign_day);
        });
    }
});