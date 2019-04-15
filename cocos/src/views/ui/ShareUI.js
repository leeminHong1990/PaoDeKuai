// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var ShareUI = UIBase.extend({
	ctor:function() {
		this._super();
		this.resourceFilename = "res/ui/ShareUI.json";
	},

	initUI:function(){
		this.hint_panel = this.rootUINode.getChildByName("hint_panel");
		var self = this;
		this.hint_panel.getChildByName("arrow_img").runAction(cc.RepeatForever.create(cc.Sequence.create(cc.MoveBy.create(0.5, cc.p(50, 0)), cc.MoveBy.create(0.5, cc.p(-50, 0)))));

		this.rootUINode.getChildByName("bg_panel").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				self.hide();
			}
		});
	},
});