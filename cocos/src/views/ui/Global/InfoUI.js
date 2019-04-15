// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var InfoUI = UIBase.extend({
	ctor:function() {
		this._super();
		this.resourceFilename = "res/ui/InfoUI.json";
	},

	initUI:function(){
		cutil.unlock_ui();
		this.info_panel = this.rootUINode.getChildByName("info_panel");
		var self = this;
		this.info_panel.getChildByName("return_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				self.hide();
			}
		});
	},

	show_by_info:function(content, c_size, confirm_btn_func){
		if(this.is_show){
			return;
		}
		c_size = c_size || cc.size(530, 302);
		var self = this;
		this.show(function(){
			// self.info_panel.setContentSize(cc.size(c_size.width + 70, c_size.height + 70));
			// self.info_panel.getChildByName("return_btn").setPosition(cc.p((c_size.width + 70) * 0.95, (c_size.height + 70) * 0.95));
			var content_label = self.info_panel.getChildByName("content_label");
			// content_label.setPosition(cc.p((c_size.width + 70) * 0.5, (c_size.height + 70) * 0.5));
			// content_label.setContentSize(c_size);
			content_label.setString(content);
			if(confirm_btn_func){
				self.info_panel.getChildByName("return_btn").addTouchEventListener(function(sender, eventType){
					if(eventType == ccui.Widget.TOUCH_ENDED){
						self.hide();
						confirm_btn_func();
					}
				});
				var confirm_btn = self.info_panel.getChildByName("confirm_btn");
				confirm_btn.addTouchEventListener(function(sender, eventType){
					if(eventType == ccui.Widget.TOUCH_ENDED){
						self.hide();
						confirm_btn_func();
					}
				});
				confirm_btn.setVisible(true);
			}
		});
	},
});