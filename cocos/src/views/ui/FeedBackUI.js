// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var FeedBackUI = UIBase.extend({
	ctor:function() {
		this._super();
		this.resourceFilename = "res/ui/FeedBackUI.json";
	},

	initUI:function(){
		this.feedback_panel = this.rootUINode.getChildByName("feedback_panel");
		var self = this;
		this.feedback_panel.getChildByName("return_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				self.hide();
			}
		});

		this.feedback_input = this.feedback_panel.getChildByName("feedback_input");
		this.feedback_panel.getChildByName("confirm_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				var content = self.feedback_input.getString();
				if(content.length > 0){
					// 发送反馈信息
					self.hide();
				} else {
					// 提示请输入内容
				}
			}
		});
	},
});