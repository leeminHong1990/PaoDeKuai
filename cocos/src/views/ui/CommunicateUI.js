// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var CommunicateUI = UIBase.extend({
	ctor:function() {
		this._super();
		this.resourceFilename = "res/ui/CommunicateUI.json";
		this.needReload = false;
		this.setLocalZOrder(const_val.MAX_LAYER_NUM);
	},

	initUI:function(){
		this.communicate_panel = this.rootUINode.getChildByName("communicate_panel");
		var player = h1global.entityManager.player();
		var self = this;
		this.communicate_panel.getChildByName("return_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				self.hide();
			}
		});

		// var btn_list = [this.communicate_panel.getChildByName("emot_btn"), this.communicate_panel.getChildByName("voice_btn")];
		 var panel_list = [this.communicate_panel.getChildByName("emot_scroll"), this.communicate_panel.getChildByName("voice_scroll")];
        //
		// this.cur_tab = UICommonWidget.create_tab(btn_list, panel_list);
		// 表情
		cc.Texture2D.defaultPixelFormat = cc.Texture2D.PIXEL_FORMAT_RGBA4444;
        var cache = cc.spriteFrameCache;
        var plist_path = "res/effect/biaoqing.plist";
        var png_path = "res/effect/biaoqing.png";
        cache.addSpriteFrames(plist_path, png_path);
    	cc.Texture2D.defaultPixelFormat = cc.Texture2D.PIXEL_FORMAT_RGBA8888;

		UICommonWidget.update_scroll_items(panel_list[0], 
			[
				[ 1,  2,  3],
				[ 4,  5,  6],
				[ 7,  8,  9]
			], 
			function(curItem, itemInfo){
				for(var i = 0; i < 3; i++){
					var emot_img = curItem.getChildByName("emot_img" + i.toString());
					if(itemInfo[i]){
						emot_img.setVisible(true);
						emot_img.addTouchEventListener(function(sender, eventType){
							if(eventType === ccui.Widget.TOUCH_ENDED){
								// 发送表情sender.num
								// cc.log("sendEmotion: ", sender.num);
								player.sendEmotion(sender.num);
								self.hide();
							}
						});
						emot_img.num = itemInfo[i];  //Emot/biaoqing_1_1.png
						emot_img.loadTexture("Emot/biaoqing_" + itemInfo[i].toString() + "_1.png", ccui.Widget.PLIST_TEXTURE);
					} else {
						emot_img.setVisible(false);
					}
				}
			}
		);
		// 语音文字
		UICommonWidget.update_scroll_items(panel_list[1], 
			const_val.MESSAGE_LIST, 
			function(curItem, itemInfo, idx){
				//var bg_img = curItem.getChildByName("bg_img");
				var content_label = curItem.getChildByName("content_label");
				// content_label.ignoreContentAdaptWithSize(true);
				if(idx + 1 < 10){
					content_label.setString(" " + (idx + 1).toString() + "." +itemInfo);
				} else {
					content_label.setString((idx + 1).toString() + "." +itemInfo);
				}
				if (itemInfo.length > 13){
                    content_label.runAction(cc.sequence(
                        cc.moveBy(2.5,cc.p(-400,0)),
						cc.place(content_label.getPositionX(),content_label.getPositionY()),
						cc.delayTime(1)
					).repeatForever())
				}
                content_label.num = idx;
				content_label.setTouchEnabled(true);
                content_label.addTouchEventListener(function(sender, eventType){
					if(eventType === ccui.Widget.TOUCH_ENDED){
						// 发送语音文字sender.num
						// cc.log("sendVoice: ", sender.num);
						player.sendMsg(sender.num);
						self.hide();
					}
				});
			}
		);

	},
});