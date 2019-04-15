// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var BroadcastUI = UIBase.extend({
	ctor:function() {
		this._super();
		this.resourceFilename = "res/ui/BroadcastUI.json";
	},

	initUI:function(){
		var broadcast_panel = this.rootUINode.getChildByName("broadcast_panel");
		this.label_panel = broadcast_panel.getChildByName("label_panel");
		this.broadcast_label = this.label_panel.getChildByName("broadcast_label");
	},

	show_broadcast:function(content, times){
		times = times || 10; // 播放次数，间隔10s
		this.stopAllActions();
		var self = this;
		function show_callback(){
			if(times > 1){
				times = times - 1;
				self.runAction(cc.Sequence.create(
					cc.DelayTime.create(10.0),
					cc.CallFunc.create(function(){
						self.show_by_content(content, show_callback);
					})
				))
			}
		}
		this.show_by_content(content, show_callback);
	},

	show_by_content:function(content, callback){
		this.hide();
		var self = this;
		this.show(function(){
			self.broadcast_label.ignoreContentAdaptWithSize(true);
			self.broadcast_label.setString(content);
			self.broadcast_label.setPositionX(0);
			self.broadcast_label.stopAllActions();
			if(self.broadcast_label.getContentSize().width <= self.label_panel.getContentSize().width){
				self.broadcast_label.runAction(cc.Sequence.create(
					cc.DelayTime.create(3.0), 
					cc.CallFunc.create(function(){
						self.hide();
						if(callback){
							callback();
						}
					})
				));
			} else {
				var offset = self.label_panel.getContentSize().width - self.broadcast_label.getContentSize().width;
				self.broadcast_label.runAction(cc.Sequence.create(
					cc.MoveTo.create(-offset * 0.01, cc.p(offset, self.broadcast_label.getPositionY())), 
					cc.DelayTime.create(3.0), 
					cc.CallFunc.create(function(){
						self.hide();
						if(callback){
							callback();
						}
					})
				));
			}
		});
	},
});