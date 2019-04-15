// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var GamePlayerInfoUI = UIBase.extend({
	ctor:function() {
		this._super();
		this.resourceFilename = "res/ui/GamePlayerInfoUI.json";
	},

	initUI:function(){
		this.playerinfo_panel = this.rootUINode.getChildByName("playerinfo_panel");

		var self = this;
		this.touch_panel = this.rootUINode.getChildByName("bg_panel");
        this.touch_panel.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });
        this.playerinfo_panel.setSwallowTouches(true);
        this.playerinfo_panel.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
            }
        });

	},

	show_by_info:function(info_dict,idxFrom,idxTo){
		// var info_dict = eval('(' + cc.sys.localStorage.getItem("INFO_JSON") + ')');
		var self = this;
		this.show(function(){
			// var frame_img = ccui.helper.seekWidgetByName(self.playerinfo_panel, "frame_img");
			// self.playerinfo_panel.reorderChild(frame_img, 1);
			cutil.loadPortraitTexture(info_dict["head_icon"], function(img){
				if(h1global.curUIMgr.gameplayerinfo_ui && h1global.curUIMgr.gameplayerinfo_ui.is_show){
					h1global.curUIMgr.gameplayerinfo_ui.rootUINode.getChildByName("playerinfo_panel").getChildByName("portrait_sprite").removeFromParent();
					var portrait_sprite  = new cc.Sprite(img);
					portrait_sprite.setName("portrait_sprite");
					portrait_sprite.setScale(81/portrait_sprite.getContentSize().width);
					portrait_sprite.x = 51;
					portrait_sprite.y = 185;
	    			h1global.curUIMgr.gameplayerinfo_ui.rootUINode.getChildByName("playerinfo_panel").addChild(portrait_sprite);
				}
			}, info_dict["uuid"].toString() + ".png");

			self.playerinfo_panel.getChildByName("name_label").setString(info_dict["nickname"]);

			// var sex_label = self.playerinfo_panel.getChildByName("sex_label");
			// if(info_dict["sex"] == 1){
			// 	sex_label.setString("男");
			// } else if(info_dict["sex"] == 2){
			// 	sex_label.setString("女");
			// } else {
			// 	sex_label.setString("未知");
			// }

			// var ip_label = self.playerinfo_panel.getChildByName("ip_label");
			// if(info_dict["ip"]){
			// 	ip_label.setString(info_dict["ip"]);
			// 	ip_label.setVisible(true);
			// } else {
			// 	ip_label.setVisible(false);
			// }

			self.playerinfo_panel.getChildByName("id_label").setString("ID:"+info_dict["userId"].toDouble().toString());

            self.init_effect_magic(idxFrom,idxTo);
            self.init_magic_pos(idxTo);
		});
	},
    getMagicPos:function (playerInfoPanel,idx) {
	    if (!playerInfoPanel){
	        return
        }
        switch(idx){
            case 0:
                var x = this.touch_panel.getContentSize().width * 0.2;
                var y = this.touch_panel.getContentSize().height * 0.32;
                break;
            case 1:
                var x = this.touch_panel.getContentSize().width * 0.74;
                var y = this.touch_panel.getContentSize().height * 0.71;
                break;
            case 2:
                var x = this.touch_panel.getContentSize().width * 0.31;
                var y = this.touch_panel.getContentSize().height * 0.82;
                break;
            case 3:
                var x = this.touch_panel.getContentSize().width * 0.26;
                var y = this.touch_panel.getContentSize().height * 0.72;
                break;
            default:
                break;
        }
        return cc.p(x, y);
    },

    init_magic_pos:function (idxTo) {
	    if (idxTo < 0){
	        return
        }
        var player = h1global.entityManager.player();
        var player_panel = this.rootUINode.getChildByName("playerinfo_panel");
        var idx = player.server2CurSitNum(idxTo);
        var fromPos = this.getMagicPos(player_panel,idx);
        if (fromPos){
            this.playerinfo_panel.setPosition(fromPos);
        }
    },

    init_effect_magic:function (idxFrom,idxTo) {
		var self = this;
        var player = h1global.entityManager.player();

        var magic_scroll=this.playerinfo_panel.getChildByName("magic_scroll");

        UICommonWidget.update_scroll_items(magic_scroll,[[1],[2],[3],[4]],
            function(curItem, itemInfo){
                for (var i = 0; i < itemInfo.length; i++) {
                    var magic_img = curItem.getChildByName("magic_img");
                    magic_img.loadTexture("res/ui/MagicUI/" + itemInfo[i].toString() + ".png");
                    magic_img.num = itemInfo[i];
                    magic_img.setSwallowTouches(true);
                    magic_img.setTouchEnabled(true);
                    magic_img.addTouchEventListener(function (sender, eventType) {
                        if (eventType === ccui.Widget.TOUCH_ENDED) {
                            player.sendMagicEmotion(sender.num, idxFrom, idxTo);
                            self.hide();
                        }
                    });
                }
            }
        );
    },
});