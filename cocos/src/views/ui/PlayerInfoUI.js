// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var PlayerInfoUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/PlayerInfoUI.json";
    },

    initUI: function () {
        this.playerinfo_panel = this.rootUINode.getChildByName("playerinfo_panel");
        var player = h1global.entityManager.player();
        var info_dict = eval('(' + cc.sys.localStorage.getItem("INFO_JSON") + ')');
        var self = this;

        this.rootUINode.getChildByName("bg_panel").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });
        this.playerinfo_panel.setSwallowTouches(true);
        this.playerinfo_panel.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
            }
        });

        // var frame_img = ccui.helper.seekWidgetByName(this.playerinfo_panel, "frame_img");
        // this.playerinfo_panel.reorderChild(frame_img, 1);
        cutil.loadPortraitTexture(info_dict["headimgurl"], function (img) {
            if (h1global.curUIMgr.playerinfo_ui && h1global.curUIMgr.playerinfo_ui.is_show) {
                h1global.curUIMgr.playerinfo_ui.rootUINode.getChildByName("playerinfo_panel").getChildByName("portrait_sprite").removeFromParent();
                var portrait_sprite = new cc.Sprite(img);
                portrait_sprite.setName("portrait_sprite");
                portrait_sprite.setScale(81 / portrait_sprite.getContentSize().width);
                portrait_sprite.x = 68;
                portrait_sprite.y = 344;
                h1global.curUIMgr.playerinfo_ui.rootUINode.getChildByName("playerinfo_panel").addChild(portrait_sprite);
            }
        });

        this.playerinfo_panel.getChildByName("name_label").setString(info_dict["nickname"]);
        // if ((cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) && switches.appstore_check == true) {
        //     this.playerinfo_panel.getChildByName("name_label").setVisible(false);
        //     this.playerinfo_panel.getChildByName("sex_img_0").setVisible(false);
        // }

        // var sex_label = this.playerinfo_panel.getChildByName("sex_label");
        // if(info_dict["sex"] == 1){
        // 	sex_label.setString("男");
        // } else if(info_dict["sex"] == 2){
        // 	sex_label.setString("女");
        // } else {
        // 	sex_label.setString("未知");
        // }

        // var ip_label = self.playerinfo_panel.getChildByName("ip_label");
        // if(player.ip){
        // 	ip_label.setString(player.ip);
        // 	ip_label.setVisible(true);
        // } else {
        // 	ip_label.setVisible(false);
        // }

        this.playerinfo_panel.getChildByName("id_label").setString(info_dict["user_id"]);
        this.init_effect_magic();
    },
    init_effect_magic: function () {
        var magic_scroll = this.playerinfo_panel.getChildByName("magic_scroll");
        UICommonWidget.update_scroll_items(magic_scroll, [[1],[2],[3],[4]],
            function (curItem, itemInfo) {
                for (var i = 0; i < itemInfo.length; i++) {
                    var magic_img = curItem.getChildByName("magic_img");
                    magic_img.loadTexture("res/ui/MagicUI/" + itemInfo[i].toString() + ".png");
                }
            }
        );
    },
});