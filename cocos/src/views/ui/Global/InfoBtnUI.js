// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var InfoBtnUI = UIBase.extend({
	ctor:function() {
		this._super();
		this.resourceFilename = "res/ui/InfoBtnUI.json";
	},

	initUI:function(){
		cutil.unlock_ui();
		this.info_panel = this.rootUINode.getChildByName("info_panel");
	},

	show_by_info:function(content, c_size, confirm_btn_func){
		if(this.is_show){
			return;
		}
		c_size = c_size || cc.size(530, 302);
		var self = this;
		this.show(function(){
			var content_label = self.info_panel.getChildByName("content_label");
			content_label.setString(content);
			if(confirm_btn_func){
				var confirm_btn = self.info_panel.getChildByName("confirm_btn");
				confirm_btn.addTouchEventListener(function(sender, eventType){
					if(eventType == ccui.Widget.TOUCH_ENDED){
						self.hide();
						confirm_btn_func();
					}
				});
				confirm_btn.setVisible(true);
			}
            var return_btn = self.info_panel.getChildByName("return_btn");
            return_btn.setVisible(true);
			return_btn.addTouchEventListener(function(sender, eventType){
				if(eventType == ccui.Widget.TOUCH_ENDED){
					self.hide();
				}
			});
		});
	}
});