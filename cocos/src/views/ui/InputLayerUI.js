"use strict";
// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var InputLayerUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/InputLayerUI.json";

    },

    initUI: function () {
        this.input_panel = this.rootUINode.getChildByName("input_panel");
        var self = this;
        this.player = h1global.entityManager.player();

        //输入框
        this.name_tf = new MyEditBox("输入", "黑体", 35, "res/ui/UnionPopUI/bg_txt_img.png");
        this.name_tf.setAnchorPoint(0, 0.5);
        this.name_tf.setPos(285, 345);
        this.rootUINode.addChild(this.name_tf);
        this.name_tf.setMaxLength(6);
        this.name_tf.setTextColor(cc.color(135, 85, 27, 255));
        //
        this.input_panel.getChildByName("cancel_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });

        this.input_panel.getChildByName("confirm_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                if (self.info === const_val.GAME_BACK_PLAY) {
                    var backCode = parseInt(self.name_tf.getString());
                    // 发送到服务端，检查名字是否合法重复
                    self.checkPlayBackCode(backCode);
                    self.hide();
                }
            }
        });
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
    },

    isNull: function (str) {
        if (str === "") return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    },

    show_name: function (info) {
        var self = this;
        this.info = info;
        this.show(function () {
            if (self.info === const_val.GAME_BACK_PLAY) {
                self.input_panel.getChildByName("title_label").setString("请输入他人分享的回放码:");
            }
        });
    }
});